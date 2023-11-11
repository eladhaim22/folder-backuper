import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config/configuration';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
