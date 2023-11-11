import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config/configuration';
import { HealthModule } from './health/health.module';
import { TaskModule } from './task/task.module';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [
    TaskModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ValidationModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
