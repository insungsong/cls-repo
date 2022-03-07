import { NestConfigModule } from '@libs/common/config/nest-config.module';
import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [NestConfigModule, DatabaseModule],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
