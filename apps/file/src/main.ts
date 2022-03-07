import { NestConfigService } from '@libs/common/config/nest-config.service';
import { FILE } from '@libs/common/constant';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { FileModule } from './file.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(FileModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService: NestConfigService =
    app.get<NestConfigService>(NestConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `${configService.rabbitmqProto}://${configService.rabbitmqUser}:${configService.rabbitmqPass}@${configService.rabbitmqHost}:${configService.rabbitmqPort}`,
      ],
      queue: FILE,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  Logger.log(`${FILE} is running on [${configService.nodeEnv}]`);

  await app.startAllMicroservices();
}

void bootstrap();
