import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum } from 'class-validator';

export enum Environment {
  DEFAULT = '',
  LOCAL = 'local',
}

@Injectable()
export class NestConfigService {
  constructor(private readonly configService: ConfigService) {}

  @IsEnum(Environment)
  get nodeEnv(): Environment {
    return this.configService.get<Environment>('NODE_ENV', Environment.DEFAULT);
  }

  get rabbitmqProto(): string {
    return this.configService.get<string>('RABBITMQ_PROTO', 'amqp');
  }

  get rabbitmqHost(): string {
    return this.configService.get<string>('RABBITMQ_HOST', 'localhost');
  }

  get rabbitmqPort(): number {
    return this.configService.get<number>('RABBITMQ_PORT', 5672);
  }

  get rabbitmqUser(): string | undefined {
    return this.configService.get<string | undefined>('RABBITMQ_USER');
  }

  get rabbitmqPass(): string | undefined {
    return this.configService.get<string | undefined>('RABBITMQ_PASS');
  }
}
