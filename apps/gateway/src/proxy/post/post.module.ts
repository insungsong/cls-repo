import { CommonModule } from '@libs/common';
import { HttpModule, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NestConfigService } from '@libs/common/config/nest-config.service';
import { POST } from '@libs/common/constant';
import { PostResolver } from './post.resolver';
import { PostProxyService } from './post.proxy.service';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [
    {
      provide: 'POST_SERVICE',
      useFactory: (config: NestConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `${config.rabbitmqProto}://${config.rabbitmqUser}:${config.rabbitmqPass}@${config.rabbitmqHost}:${config.rabbitmqPort}`,
            ],
            queue: POST,
            noAck: true,
            queueOptions: {
              durable: true,
            },
          },
        }),
      inject: [NestConfigService],
    },
    PostProxyService,
    PostResolver,
    NestConfigService,
  ],
})
export class PostModule {}
