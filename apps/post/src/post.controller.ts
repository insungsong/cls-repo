import {
  DeleteChatInput,
  FetchChatsInput,
  RegisterChatInput,
} from '@libs/common/dto';
import { DeleteSpacePostInput } from '@libs/common/dto/delete-space-post.input';
import { FetchSpacePostsInput } from '@libs/common/dto/fetch-space-posts.input';
import { RegisterPostInput } from '@libs/common/dto/register-post.input';
import { Output } from '@libs/common/model';
import { ChatsOutput } from '@libs/common/model/chats.output';
import { PostsOutput } from '@libs/common/model/posts.output';
import { TransactionBlock } from '@libs/common/transaction/transaction';
import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern({ cmd: 'registerPost' })
  async registerPost(input: RegisterPostInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.postService.registerPost(
          input as RegisterPostInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: 'fetchSpacePosts' })
  async fetchSpacePosts(input: FetchSpacePostsInput): Promise<PostsOutput> {
    return await this.postService.fetchSpacePosts(input);
  }

  @MessagePattern({ cmd: 'fetchChats' })
  async fetchChats(input: FetchChatsInput): Promise<ChatsOutput> {
    return await this.postService.fetchChats(input);
  }

  @MessagePattern({ cmd: 'deleteSpacePost' })
  async deleteSpacePost(input: DeleteSpacePostInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.postService.deleteSpacePost(
          input as DeleteSpacePostInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: 'registerChat' })
  async registerChat(input: RegisterChatInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.postService.registerChat(
          input as RegisterChatInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: 'deleteChat' })
  async deleteChat(input: DeleteChatInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.postService.deleteChat(
          input as DeleteChatInput,
          entityManager,
        );
      },
    );
  }
}
