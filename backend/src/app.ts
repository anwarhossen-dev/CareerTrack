import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import applicationRoutes from './routes/application.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS to whitelist local frontend ports
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [
    clientUrl,
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174'
  ],
  credentials: true,
}));

// Request parser
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ok',
    message: 'CareerTrack Lite API is running',
    timestamp: new Date(),
  });
});

// Bind routing modules
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Register fallback error handling middleware
app.use(errorHandler);

export default app;
