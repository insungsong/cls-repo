import { NestConfigModule } from '@libs/common/config/nest-config.module';
import { DatabaseModule } from '@libs/database';
import { UserRepository } from '@libs/database/repository';
import { ChatRepository } from '@libs/database/repository/chat.repository';
import { PostRepository } from '@libs/database/repository/post.repository';
import { SpaceRoleRepository } from '@libs/database/repository/space-role.repository';
import { SpaceRepository } from '@libs/database/repository/space.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    NestConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      UserRepository,
      SpaceRepository,
      SpaceRoleRepository,
      PostRepository,
      ChatRepository,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
