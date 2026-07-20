import { Router } from 'express';
import { getDashboardStats, getAdminStats } from '../controllers/dashboard.controller';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats', authenticateJWT, getDashboardStats);
router.get('/admin/stats', authenticateJWT, requireAdmin, getAdminStats);

export default router;
