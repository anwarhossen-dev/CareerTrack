import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateJWT } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Apply JWT authentication
router.use(authenticateJWT);

// GET /api/dashboard/stats
router.get('/stats', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'User unauthorized' });
  }

  try {
    // 1. Fetch total count of user's applications
    const totalApplications = await prisma.application.count({
      where: { userId },
    });

    // 2. Fetch counts grouped by status
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true,
      },
    });

    // Convert group by results to key-value pairs for easier usage
    const stats: { [key: string]: number } = {
      Saved: 0,
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Rejected: 0,
      Offer: 0,
    };

    statusCounts.forEach((group) => {
      if (group.status in stats) {
        stats[group.status] = group._count.status;
      }
    });

    // 3. Fetch 5 recently added applications
    const recentApplications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return res.json({
      total: totalApplications,
      stats,
      recentApplications,
    });
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return res.status(500).json({ error: 'Failed to retrieve dashboard statistics.' });
  }
});

export default router;
