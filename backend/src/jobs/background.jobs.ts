import { JobScheduler } from './index.jobs';
import { PrismaClient } from '@prisma/client';

import { logger } from '../config/logger.config';

const prisma = new PrismaClient();

export const startBackgroundJobs = () => {
  try {
    if (process.env['NODE_ENV'] === 'test') {
      return;
    }

    const jobScheduler = new JobScheduler(prisma);
    jobScheduler.startAll();

    logger.info('Background jobs started');
  } catch (error) {
    logger.error('Failed to start background jobs:', error);
  }
};
