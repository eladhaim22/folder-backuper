import * as fs from 'fs';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { glob } from 'glob';
import { DateTime } from 'luxon';

import { DATE_FORMAT } from './backup.service';

const CRON_NAME = 'CLEAN_UP';

@Injectable()
export class CleanUpService {
  private readonly logger = new Logger(CleanUpService.name);
  constructor(
    protected schedulerRegistry: SchedulerRegistry,
    protected configService: ConfigService,
  ) {}

  onModuleInit() {
    const job = new CronJob('0 0 * * *', async () => {
      try {
        await this.handleCron();
      } catch (e) {
        this.logger.error(e);
      }
    });
    this.schedulerRegistry.addCronJob(CRON_NAME, job);
    job.start();
  }

  onModuleDestroy() {
    this.schedulerRegistry.deleteCronJob(CRON_NAME);
  }

  private async handleCron() {
    const backupPlan =
      this.configService.get<
        { source: string; target: string; retention: number }[]
      >('config.backupPlan');

    for (const backup of backupPlan) {
      const retention = backup.retention || 28;
      this.logger.log(`looking for files to clean up in ${backup.target}`);
      const files = await glob(`*.gz`, { cwd: backup.target });
      for (const file of files) {
        const fileDate = DateTime.fromFormat(
          file.replace('.tar.gz', ''),
          DATE_FORMAT,
        );

        if (DateTime.now() > fileDate.plus({ days: retention })) {
          this.logger.log(`Removing ${backup.target}/${file}`);
          fs.unlinkSync(`${backup.target}/${file}`);
        }
      }
    }
  }
}
