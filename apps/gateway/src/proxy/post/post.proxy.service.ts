import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SayHelloOuput } from '@libs/common/model/say-hello.output';
import { lastValueFrom } from 'rxjs';
import {
  DeleteChatInput,
  RegisterChatInput,
  RegisterUserInput,
  SayHelloInput,
} from '@libs/common/dto';
import { NestException, Output, RegisterUserOutput } from '@libs/common/model';
import { UserEntity } from '@libs/database/entities';
import { RegisterSpaceInput } from '@libs/common/dto/register-space.input';
import { RegisterPostInput } from '@libs/common/dto/register-post.input';
import { FetchSpacePostsInput } from '@libs/common/dto/fetch-space-posts.input';
import { PostsOutput } from '@libs/common/model/posts.output';
import { DeleteSpacePostInput } from '@libs/common/dto/delete-space-post.input';

@Injectable()
export class PostProxyService {
  private readonly logger: Logger;

  constructor(@Inject('POST_SERVICE') private client: ClientProxy) {
    this.logger = new Logger('PostProxyService');
  }

  async registerPost(input: RegisterPostInput): Promise<Output> {
    this.logger.debug(input);

    return await lastValueFrom(
      this.client.send<Output>({ cmd: 'registerPost' }, input),
    );
  }

  async fetchSpacePosts(input: FetchSpacePostsInput): Promise<PostsOutput> {
    this.logger.debug(input);

    return await lastValueFrom(
      this.client.send<PostsOutput>({ cmd: 'fetchSpacePosts' }, input),
    );
  }

  async deleteSpacePost(input: DeleteSpacePostInput): Promise<Output> {
    this.logger.debug(input);

    return await lastValueFrom(
      this.client.send<Output>({ cmd: 'deleteSpacePost' }, input),
    );
  }

  async registerChat(input: RegisterChatInput): Promise<Output> {
    this.logger.debug(input);
    return await lastValueFrom(
      this.client.send<Output>({ cmd: 'registerChat' }, input),
    );
  }

  async deleteChat(input: DeleteChatInput): Promise<Output> {
    this.logger.debug(input);
    return await lastValueFrom(
      this.client.send<Output>({ cmd: 'deleteChat' }, input),
    );
  }
}
