import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { BackupService } from './backup.service';
import { CleanUpService } from './clean-up.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [BackupService, CleanUpService],
})
export class TaskModule {}
