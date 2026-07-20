import { Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'User unauthorized' });
  }

  try {
    // Fetch total count of user's applications
    const totalApplications = await prisma.application.count({
      where: { userId },
    });

    // Fetch counts grouped by status
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true,
      },
    });

    // Initialize metrics dictionary
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

    // Fetch 5 recently added applications
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
    next(error);
  }
};
