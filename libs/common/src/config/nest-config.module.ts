import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Environment, NestConfigService } from './nest-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: [
        join(__dirname, '../../..', `${Environment.DEFAULT}.env`),
        join(__dirname, '../../..', `${Environment.PRODUCTION}.env`),
      ],
    }),
  ],
  providers: [ConfigService, NestConfigService],
  exports: [ConfigService, NestConfigService],
})
export class NestConfigModule {}
