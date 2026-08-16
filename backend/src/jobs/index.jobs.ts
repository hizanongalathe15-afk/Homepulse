import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config';

export class JobScheduler {
  private prisma: PrismaClient;
  private jobs: Map<string, { job: any; interval: NodeJS.Timeout }> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  startAll() {
    const jobs = [
      { name: 'bannerScheduler', job: new (require('./bannerScheduler.job').BannerSchedulerJob)(this.prisma), interval: 3600000 },
      { name: 'expireListings', job: new (require('./expireListings.job').ExpireListingsJob)(this.prisma), interval: 86400000 },
      { name: 'expireQRCodes', job: new (require('./expireQRCodes.job').ExpireQRCodesJob)(this.prisma), interval: 3600000 },
      { name: 'generateAnalytics', job: new (require('./generateAnalytics.job').GenerateAnalyticsJob)(this.prisma), interval: 86400000 },
      { name: 'reindexSearch', job: new (require('./reindexSearch.job').ReindexSearchJob)(this.prisma), interval: 86400000 },
      { name: 'releaseEscrow', job: new (require('./releaseEscrow.job').ReleaseEscrowJob)(this.prisma), interval: 3600000 },
      { name: 'sendReminders', job: new (require('./sendReminders.job').SendRemindersJob)(this.prisma, null), interval: 3600000 },
      { name: 'sendSavedSearchAlerts', job: new (require('./sendSavedSearchAlerts.job').SendSavedSearchAlertsJob)(this.prisma, null), interval: 86400000 },
      { name: 'updateScores', job: new (require('./updateScores.job').UpdateScoresJob)(this.prisma), interval: 604800000 },
    ];

    for (const { name, job, interval } of jobs) {
      const timer = setInterval(async () => {
        logger.info(`Running job: ${name}`);
        await job.execute();
      }, interval);

      this.jobs.set(name, { job, interval: timer });
      logger.info(`Job scheduled: ${name} (every ${interval}ms)`);
    }
  }

  stopAll() {
    for (const [name, { interval }] of this.jobs) {
      clearInterval(interval);
      logger.info(`Job stopped: ${name}`);
    }
    this.jobs.clear();
  }

  async runJob(name: string) {
    const jobData = this.jobs.get(name);
    if (jobData) {
      logger.info(`Running job manually: ${name}`);
      return await jobData.job.execute();
    }
    return { success: false, error: 'Job not found' };
  }
}
