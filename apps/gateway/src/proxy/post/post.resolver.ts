import { ServiceType } from '@libs/common/constant';
import { DeleteChatInput, RegisterChatInput } from '@libs/common/dto';
import { DeleteSpacePostInput } from '@libs/common/dto/delete-space-post.input';
import { FetchSpacePostsInput } from '@libs/common/dto/fetch-space-posts.input';
import { RegisterPostInput } from '@libs/common/dto/register-post.input';
import { RegisterSpaceInput } from '@libs/common/dto/register-space.input';
import { Output } from '@libs/common/model';
import { PostsOutput } from '@libs/common/model/posts.output';
import { Logger } from '@nestjs/common';
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ScopedAuth } from '../../decorator/scoped-auth.decorator';
import { CurrentUser } from '../../decorator/user.decorator';
import { PostProxyService } from './post.proxy.service';

@Resolver('post')
export class PostResolver {
  private readonly logger: Logger;

  constructor(private readonly postProxyService: PostProxyService) {
    this.logger = new Logger('PostResolver');
  }

  @Mutation(() => Output)
  @ScopedAuth([ServiceType.USER])
  async registerPost(
    @CurrentUser() user: any,
    @Args('input') input: RegisterPostInput,
  ): Promise<Output> {
    return await this.postProxyService.registerPost({
      email: user.email,
      ...input,
    });
  }

  @Query(() => PostsOutput)
  @ScopedAuth([ServiceType.USER])
  async fetchSpacePosts(
    @CurrentUser() user: any,
    @Args('input') input: FetchSpacePostsInput,
  ): Promise<PostsOutput> {
    return await this.postProxyService.fetchSpacePosts({
      email: user.email,
      ...input,
    });
  }

  @Mutation(() => Output)
  @ScopedAuth([ServiceType.USER])
  async deleteSpacePost(
    @CurrentUser() user: any,
    @Args('input') input: DeleteSpacePostInput,
  ): Promise<Output> {
    return await this.postProxyService.deleteSpacePost({
      email: user.email,
      ...input,
    });
  }
  @Mutation(() => Output)
  async registerChat(
    @CurrentUser() user: any,
    input: RegisterChatInput,
  ): Promise<Output> {
    return await this.postProxyService.registerChat({
      email: user.email,
      ...input,
    });
  }

  @Mutation(() => Output)
  async deleteChat(
    @CurrentUser() user: any,
    input: DeleteChatInput,
  ): Promise<Output> {
    return await this.postProxyService.deleteChat({
      email: user.email,
      ...input,
    });
  }
}
