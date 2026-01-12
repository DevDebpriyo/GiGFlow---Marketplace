import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import gigsRoutes from './routes/gigs.js';
import bidsRoutes from './routes/bids.js';
import { connectDb } from './db.js';

dotenv.config();

const app = express();

// Allow requests from all origins for now.
// Note: when credentials=true, CORS cannot use origin='*', so we reflect the request origin.
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigsRoutes);
app.use('/api/bids', bidsRoutes);

// Basic error handler
app.use((err, _req, res, _next) => {
  return res.status(500).json({ message: 'Server error' });
});

const port = Number(process.env.PORT || 5000);

await connectDb(process.env.MONGODB_URI);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
