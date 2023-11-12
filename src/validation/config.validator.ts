import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as BaseJoi from 'joi';
import * as JoiCron from 'joi-cron-expression';

const Joi = JoiCron(BaseJoi);

const schema = Joi.object({
  backupPlan: Joi.array()
    .min(1)
    .items(
      Joi.object({
        globExpression: Joi.string().required(),
        baseSource: Joi.string().required(),
        target: Joi.string().required(),
        retention: Joi.number(),
      }),
    ),
  port: Joi.number().required(),
  cronExpression: Joi.string().cron().required(),
}) as BaseJoi.ObjectSchema;

@Injectable()
export class ConfigValidator implements OnModuleInit {
  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    const config = this.configService.get('config');
    await schema.validateAsync(config);
  }
}
