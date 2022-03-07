import { CommonModule } from '@libs/common';
import { NestConfigService } from '@libs/common/config/nest-config.service';
import { FILE } from '@libs/common/constant';
import { HttpModule, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../multer-config.service';

import { FileController } from './file.controller';
import { FileProxyService } from './file.proxy.service';

@Module({
  imports: [
    HttpModule,
    CommonModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FileController],
  providers: [
    {
      provide: 'FILE_SERVICE',
      useFactory: (config: NestConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `${config.rabbitmqProto}://${config.rabbitmqUser}:${config.rabbitmqPass}@${config.rabbitmqHost}:${config.rabbitmqPort}`,
            ],
            queue: FILE,
            noAck: true,
            queueOptions: {
              durable: true,
            },
          },
        }),
      inject: [NestConfigService],
    },
    FileProxyService,
  ],
  exports: [FileProxyService],
})
export class FileModule {}
