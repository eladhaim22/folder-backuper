import * as fs from 'fs';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as tar from 'tar';

const CRON_NAME = 'BACKUP_TASK';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
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
      this.configService.get<{ source: string; target: string }[]>(
        'config.backupPlan',
      );

    for (const backup of backupPlan) {
      this.logger.log(
        `backing up source: ${backup.source} to target ${backup.target}`,
      );
      const backupSourceArray = backup.source.split('/');
      console.log(backupSourceArray);
      const folder = backupSourceArray.pop();
      console.log(backupSourceArray.join('/'));

      try {
        tar
          .c(
            {
              gzip: true,
              cwd: backupSourceArray.join('/'),
            },
            [folder],
          )
          .pipe(
            fs.createWriteStream(
              `${backup.target}/${this.getFileName()}.tar.gz`,
            ),
            () => this.logger.log('backup finished'),
          );
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  private getFileName() {
    const date = new Date();
    return `${date.getFullYear()}.${date.getMonth()}.${date.getDay()}_${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;
  }
}
