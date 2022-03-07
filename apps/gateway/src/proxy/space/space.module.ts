import { CommonModule } from '@libs/common';
import { HttpModule, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NestConfigService } from '@libs/common/config/nest-config.service';
import { SPACE } from '@libs/common/constant';
import { SpaceProxyService } from './space.proxy.service';
import { SpaceResolver } from './space.resolver';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [
    {
      provide: 'SPACE_SERVICE',
      useFactory: (config: NestConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `${config.rabbitmqProto}://${config.rabbitmqUser}:${config.rabbitmqPass}@${config.rabbitmqHost}:${config.rabbitmqPort}`,
            ],
            queue: SPACE,
            noAck: true,
            queueOptions: {
              durable: true,
            },
          },
        }),
      inject: [NestConfigService],
    },
    SpaceProxyService,
    SpaceResolver,
    NestConfigService,
  ],
})
export class SpaceModule {}
