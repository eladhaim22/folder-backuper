import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { glob } from 'glob';
import { DateTime } from 'luxon';
import * as tar from 'tar';

import { BackupPlan } from '../models/backup.model';

const CRON_NAME = 'BACKUP_TASK';

export const DATE_FORMAT = 'yyyy.MM.dd_HH.mm.ss';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  constructor(
    protected schedulerRegistry: SchedulerRegistry,
    protected configService: ConfigService,
  ) {}

  onModuleInit() {
    const job = new CronJob(
      this.configService.get(`config.cronExpression`),
      async () => {
        try {
          await this.handleCron();
        } catch (e) {
          this.logger.error(e);
        }
      },
    );
    this.schedulerRegistry.addCronJob(CRON_NAME, job);
    job.start();
  }

  onModuleDestroy() {
    this.schedulerRegistry.deleteCronJob(CRON_NAME);
  }

  private async handleCron() {
    const backupPlan =
      this.configService.get<BackupPlan[]>('config.backupPlan');

    for (const backup of backupPlan) {
      this.logger.log(
        `backing up sources with glob expressions
        ${backup.globExpression} from source folder ${backup.baseSource} to target ${backup.target}`,
      );
      const files = await glob(backup.globExpression, {
        cwd: backup.baseSource,
      });
      try {
        await tar.c(
          {
            gzip: true,
            file: `${backup.target}/${this.getFileName()}.tar.gz`,
            cwd: backup.baseSource,
          },
          files,
        );
        this.logger.log('backup finished');
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  private getFileName() {
    return DateTime.now().toFormat(DATE_FORMAT);
  }
}
