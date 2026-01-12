import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    budget: { type: Number, required: true, min: 1 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'assigned'], default: 'open' },
  },
  { timestamps: true }
);

export const Gig = mongoose.models.Gig || mongoose.model('Gig', gigSchema);
