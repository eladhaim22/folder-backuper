import { Module } from '@nestjs/common';

import { ConfigValidator } from './config.validator';

@Module({
  providers: [ConfigValidator],
})
export class ValidationModule {}
