import { NestConfigModule } from '@libs/common/config/nest-config.module';
import { DatabaseModule } from '@libs/database';
import { Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [NestConfigModule, DatabaseModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
