import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import applicationsRouter from './routes/applications';
import dashboardRouter from './routes/dashboard';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with client origin configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [
    clientUrl, 
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174'
  ],
  credentials: true,
}));

// Body parser
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ok',
    message: 'CareerTrack Lite API is running',
    timestamp: new Date(),
  });
});

// Bind routers
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/dashboard', dashboardRouter);

// Start server
app.listen(PORT, () => {
  console.log(`[server]: CareerTrack Lite Backend running on http://localhost:${PORT}`);
});
