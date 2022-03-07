import { NestConfigService } from '@libs/common/config/nest-config.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { POST, SPACE } from '@libs/common/constant';
import { SpaceModule } from './space.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(SpaceModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService: NestConfigService =
    app.get<NestConfigService>(NestConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `${configService.rabbitmqProto}://${configService.rabbitmqUser}:${configService.rabbitmqPass}@${configService.rabbitmqHost}:${configService.rabbitmqPort}`,
      ],
      queue: SPACE,
      noAck: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  Logger.log(`${SPACE} is running on [${configService.nodeEnv}]`);

  await app.startAllMicroservices();
}
bootstrap();
