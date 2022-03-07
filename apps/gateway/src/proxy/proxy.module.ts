import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { FileModule } from './file/file.module';
import { PostModule } from './post/post.module';
import { SpaceModule } from './space/space.module';

@Module({
  imports: [AuthenticationModule, FileModule, SpaceModule, PostModule],
})
export class ProxyModule {}
