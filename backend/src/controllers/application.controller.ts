import { Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const VALID_SOURCES = ['LinkedIn', 'Bdjobs', 'Indeed', 'Wellfound', 'Facebook', 'Referral', 'Other'];
const VALID_STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];

export const createApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { companyName, jobTitle, jobUrl, source, status, applicationDate, notes } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'User unauthorized' });
  }

  // Validations
  if (!companyName || !companyName.trim()) {
    return res.status(400).json({ error: 'Company name is required.' });
  }
  if (!jobTitle || !jobTitle.trim()) {
    return res.status(400).json({ error: 'Job title is required.' });
  }
  if (!source || !VALID_SOURCES.includes(source)) {
    return res.status(400).json({ error: `Invalid application source. Allowed values: ${VALID_SOURCES.join(', ')}` });
  }
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid application status. Allowed values: ${VALID_STATUSES.join(', ')}` });
  }
  if (!applicationDate) {
    return res.status(400).json({ error: 'Application date is required.' });
  }

  try {
    const application = await prisma.application.create({
      data: {
        userId,
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobUrl: jobUrl ? jobUrl.trim() : null,
        source,
        status,
        applicationDate: new Date(applicationDate),
        notes: notes ? notes.trim() : null,
      },
    });

    return res.status(201).json({
      message: 'Application created successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const listApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'User unauthorized' });
  }

  const { search, status, source, sort } = req.query;

  // Build filter conditions
  const whereCondition: any = {
    userId,
  };

  if (search) {
    const searchString = String(search).trim();
    whereCondition.OR = [
      { companyName: { contains: searchString, mode: 'insensitive' } },
      { jobTitle: { contains: searchString, mode: 'insensitive' } },
    ];
  }

  if (status && VALID_STATUSES.includes(String(status))) {
    whereCondition.status = String(status);
  }

  if (source && VALID_SOURCES.includes(String(source))) {
    whereCondition.source = String(source);
  }

  let orderByCondition: any = { createdAt: 'desc' };

  if (sort === 'oldest') {
    orderByCondition = { applicationDate: 'asc' };
  } else if (sort === 'newest') {
    orderByCondition = { applicationDate: 'desc' };
  } else if (sort === 'created_asc') {
    orderByCondition = { createdAt: 'asc' };
  }

  try {
    const applications = await prisma.application.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
    });

    return res.json({ applications });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'User unauthorized' });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    if (application.userId !== userId) {
      return res.status(403).json({ error: 'Access denied. You do not own this application.' });
    }

    return res.json({ application });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { companyName, jobTitle, jobUrl, source, status, applicationDate, notes } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'User unauthorized' });
  }

  try {
    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ error: 'Access denied. You do not own this application.' });
    }

    const updateData: any = {};

    if (companyName !== undefined) {
      if (!companyName.trim()) {
        return res.status(400).json({ error: 'Company name cannot be empty.' });
      }
      updateData.companyName = companyName.trim();
    }

    if (jobTitle !== undefined) {
      if (!jobTitle.trim()) {
        return res.status(400).json({ error: 'Job title cannot be empty.' });
      }
      updateData.jobTitle = jobTitle.trim();
    }

    if (jobUrl !== undefined) {
      updateData.jobUrl = jobUrl ? jobUrl.trim() : null;
    }

    if (source !== undefined) {
      if (!VALID_SOURCES.includes(source)) {
        return res.status(400).json({ error: `Invalid application source. Allowed values: ${VALID_SOURCES.join(', ')}` });
      }
      updateData.source = source;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid application status. Allowed values: ${VALID_STATUSES.join(', ')}` });
      }
      updateData.status = status;
    }

    if (applicationDate !== undefined) {
      if (!applicationDate) {
        return res.status(400).json({ error: 'Application date cannot be empty.' });
      }
      updateData.applicationDate = new Date(applicationDate);
    }

    if (notes !== undefined) {
      updateData.notes = notes ? notes.trim() : null;
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: updateData,
    });

    return res.json({
      message: 'Application updated successfully',
      application: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'User unauthorized' });
  }

  try {
    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ error: 'Access denied. You do not own this application.' });
    }

    await prisma.application.delete({
      where: { id },
    });

    return res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
};
