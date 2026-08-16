import { Worker } from './worker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeWorker = () => {
  try {
    const worker = new Worker(prisma);
    worker.start();

    process.on('SIGINT', () => {
      worker.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      worker.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to initialize worker:', error);
  }
};
