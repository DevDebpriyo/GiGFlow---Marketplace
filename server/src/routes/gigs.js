import express from 'express';
import mongoose from 'mongoose';
import { Gig } from '../models/Gig.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const gigs = await Gig.find(filter)
      .sort({ createdAt: -1 })
      .populate('ownerId', '_id name email createdAt updatedAt');

    return res.json({ gigs });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch gigs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    const gig = await Gig.findById(id).populate('ownerId', '_id name email createdAt updatedAt');
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    return res.json({ gig });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch gig' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, budget } = req.body ?? {};

    if (!title || !description || typeof budget !== 'number') {
      return res.status(400).json({ message: 'Title, description, and budget are required' });
    }

    const gig = await Gig.create({
      title: String(title).trim(),
      description: String(description).trim(),
      budget,
      ownerId: req.user._id,
      status: 'open',
    });

    const populated = await Gig.findById(gig._id).populate('ownerId', '_id name email createdAt updatedAt');
    return res.status(201).json({ gig: populated });
  } catch {
    return res.status(500).json({ message: 'Failed to create gig' });
  }
});

export default router;
