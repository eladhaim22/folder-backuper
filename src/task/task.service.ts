import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as fse from 'fs-extra';

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
        'backupPlan',
      );

    for (const backup of backupPlan) {
      this.logger.log(
        `backing up source: ${backup.source} to target ${backup.target}`,
      );
      try {
        fse.copySync(backup.source, backup.target, { overwrite: true });
        this.logger.log('backup finished');
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
