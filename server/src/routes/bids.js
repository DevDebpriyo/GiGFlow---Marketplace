import express from 'express';
import mongoose from 'mongoose';
import { Bid } from '../models/Bid.js';
import { Gig } from '../models/Gig.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:gigId', async (req, res) => {
  try {
    const { gigId } = req.params;
    if (!mongoose.isValidObjectId(gigId)) {
      return res.json({ bids: [] });
    }

    const bids = await Bid.find({ gigId })
      .sort({ createdAt: -1 })
      .populate('freelancerId', '_id name email createdAt updatedAt');

    return res.json({ bids });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch bids' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { gigId, message, price } = req.body ?? {};

    if (!gigId || !message || typeof price !== 'number') {
      return res.status(400).json({ message: 'gigId, message, and price are required' });
    }

    if (!mongoose.isValidObjectId(gigId)) {
      return res.status(400).json({ message: 'Invalid gigId' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is not open for bidding' });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message: String(message).trim(),
      price,
      status: 'pending',
    });

    const populated = await Bid.findById(bid._id).populate('freelancerId', '_id name email createdAt updatedAt');
    return res.status(201).json({ bid: populated });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: 'You already submitted a bid for this gig' });
    }
    return res.status(500).json({ message: 'Failed to create bid' });
  }
});

router.patch('/:bidId/hire', requireAuth, async (req, res) => {
  try {
    const { bidId } = req.params;
    if (!mongoose.isValidObjectId(bidId)) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig already assigned' });
    }

    await Gig.updateOne({ _id: gig._id }, { $set: { status: 'assigned' } });

    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { $set: { status: 'rejected' } }
    );

    await Bid.updateOne({ _id: bid._id }, { $set: { status: 'hired' } });

    const bids = await Bid.find({ gigId: gig._id })
      .sort({ createdAt: -1 })
      .populate('freelancerId', '_id name email createdAt updatedAt');

    return res.json({ bids });
  } catch {
    return res.status(500).json({ message: 'Failed to hire' });
  }
});

export default router;
