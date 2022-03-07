import { ChatStatus, ErrorCode } from '@libs/common/constant';
import { PostStatus } from '@libs/common/constant/post-status.type';
import { PostType } from '@libs/common/constant/post.type';
import { SpaceRoleStatus } from '@libs/common/constant/space-role-status.type';
import { SpaceRoleType } from '@libs/common/constant/space-role.type';
import { SpaceStatusType } from '@libs/common/constant/space-status.type';
import { DeleteChatInput, RegisterChatInput } from '@libs/common/dto';
import { DeleteSpacePostInput } from '@libs/common/dto/delete-space-post.input';
import { FetchSpacePostsInput } from '@libs/common/dto/fetch-space-posts.input';
import { RegisterPostInput } from '@libs/common/dto/register-post.input';
import { NestException, Output } from '@libs/common/model';
import { PostsOutput } from '@libs/common/model/posts.output';
import { UserRepository } from '@libs/database/repository';
import { ChatRepository } from '@libs/database/repository/chat.repository';
import { PostRepository } from '@libs/database/repository/post.repository';
import { SpaceRoleRepository } from '@libs/database/repository/space-role.repository';
import { SpaceRepository } from '@libs/database/repository/space.repository';
import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Not } from 'typeorm';

@Injectable()
export class PostService {
  private readonly logger: Logger;
  constructor(
    private readonly userRepsitory: UserRepository,
    private readonly spaceRepsitory: SpaceRepository,
    private readonly spaceRoleRepository: SpaceRoleRepository,
    private readonly postRepository: PostRepository,
  ) {
    this.logger = new Logger('PostService');
  }

  async registerPost(
    input: RegisterPostInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepsitory: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    const user = await userRepsitory.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    const spaceRepository: SpaceRepository =
      entityManager.getCustomRepository<SpaceRepository>(SpaceRepository);

    //Space
    const partnerSpace = await spaceRepository.findOne({
      id: input.spaceId,
      status: SpaceStatusType.SPACE,
    });

    if (!partnerSpace) {
      throw new NestException(ErrorCode.NOT_FOUND_PARTNER_SPACE);
    }

    //Space 참여자
    let space = null;

    if (partnerSpace.userId === user.id) {
      //생성자
      space = await spaceRepository.findOne({
        id: partnerSpace.id,
        userId: user.id,
      });
    } else {
      //생성자가 아닌 모든 사람
      space = await spaceRepository.findOne({
        parentsSpaceId: partnerSpace.id,
        userId: user.id,
      });
    }

    console.log('space: ', space);

    if (!space) {
      throw new NestException(ErrorCode.NOT_FOUND_SPACE);
    }

    const spaceRoleRepository: SpaceRoleRepository =
      entityManager.getCustomRepository<SpaceRoleRepository>(
        SpaceRoleRepository,
      );

    const spaceRole = await spaceRoleRepository.findOne({
      id: space.spaceRoleId,
      status: Not(SpaceRoleStatus.DELETED),
    });

    if (!spaceRole) {
      throw new NestException(ErrorCode.NOT_FOUND_SPACE_ROLE);
    }

    //TO DO질문 || 공지에 따른 분기문 처리
    if (
      spaceRole.role === SpaceRoleType.PARTICIPANT &&
      input.type === PostType.NOTIFICATION
    ) {
      throw new NestException(ErrorCode.YOU_DO_NOT_HAVE_PERMISSION);
    }

    if (
      input.type === PostType.QUESTION &&
      input.anonymous &&
      spaceRole.role !== SpaceRoleType.PARTICIPANT
    ) {
      throw new NestException(
        ErrorCode.ADMINS_CAN_NOT_ANONYMOUSLY_POST_QUESTIONS,
      );
    }

    const postRepository: PostRepository =
      entityManager.getCustomRepository<PostRepository>(PostRepository);

    await postRepository
      .create({
        userId: user.id,
        anonymous: input.anonymous,
        spaceId: partnerSpace.id,
        type: input.type,
      })
      .save();

    return {
      result: ErrorCode.SUCCESS,
    };
  }

  async fetchSpacePosts(input: FetchSpacePostsInput): Promise<PostsOutput> {
    const user = await this.userRepsitory.findRegisteredUserByEmail(
      input.email,
    );

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    const parentsSpace = await this.spaceRepsitory.findOne({
      id: input.spaceId,
      status: SpaceStatusType.SPACE,
    });

    if (!parentsSpace) {
      throw new NestException(ErrorCode.NOT_FOUND_PARTNER_SPACE);
    }

    let space = null;

    if (user.id === parentsSpace.userId) {
      space = await this.spaceRepsitory.findOne({
        id: parentsSpace.id,
        userId: user.id,
      });
    } else {
      space = await this.spaceRepsitory.findOne({
        parentsSpaceId: parentsSpace.id,
        userId: user.id,
      });
    }

    const spaceRole = await this.spaceRoleRepository.findOne({
      id: space.spaceRoleId,
      status: Not(SpaceRoleStatus.DELETED),
    });

    let result = null;
    if (spaceRole.role !== SpaceRoleType.PARTICIPANT) {
      result = await this.postRepository.fetchSpacePosts(input.spaceId);
    } else {
      result = await this.postRepository.fetchNotAnonymousPosts(
        input.spaceId,
        user.id,
      );
    }

    return {
      result: ErrorCode.SUCCESS,
      data: [...result],
    } as PostsOutput;
  }

  async deleteSpacePost(
    input: DeleteSpacePostInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    const postRepository: PostRepository =
      entityManager.getCustomRepository<PostRepository>(PostRepository);

    const post = await postRepository.findOne({
      id: input.postId,
    });

    const spaceRepository: SpaceRepository =
      entityManager.getCustomRepository<SpaceRepository>(SpaceRepository);

    const space = await spaceRepository.findOne({
      id: post.spaceId,
      status: SpaceStatusType.SPACE,
    });

    if (!space) {
      throw new NestException(ErrorCode.NOT_FOUND_SPACE);
    }

    if (space.userId !== user.id && post.userId !== user.id) {
      throw new NestException(ErrorCode.NOT_MATCHING_AUTHOR);
    }

    await postRepository.update(
      {
        id: post.id,
      },
      { status: PostStatus.DELETED },
    );

    return {
      result: ErrorCode.SUCCESS,
    };
  }

  async registerChat(
    input: RegisterChatInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    //해당 유저가 해당 space에 가입자인지 확인한다. - 해당 space 가입자가 아니면 Error
    const spaceRepository: SpaceRepository =
      entityManager.getCustomRepository<SpaceRepository>(SpaceRepository);

    const space = await spaceRepository.findOne({
      id: input.spaceId,
      userId: user.id,
    });

    if (!space) {
      throw new NestException(ErrorCode.NOT_FOUND_SPACE);
    }

    const postRepository: PostRepository =
      entityManager.getCustomRepository<PostRepository>(PostRepository);

    const post = await postRepository.findOne({
      id: input.postId,
      spaceId: space.id,
    });

    if (!post) {
      throw new NestException(ErrorCode.NOT_FOUND_POST);
    }

    const chatRepository: ChatRepository =
      entityManager.getCustomRepository<ChatRepository>(ChatRepository);

    if (input.parentsChatId) {
      const parentChat = await chatRepository.findOne({
        id: input.parentsChatId,
        postId: post.id,
      });

      if (!parentChat) {
        throw new NestException(ErrorCode.NOT_FOUND_PARENT_CHAT);
      }

      await entityManager.save(
        chatRepository.create({
          userId: user.id,
          anonymous: input.anonymous,
          content: input.content,
          parentsChatId: parentChat.id,
        }),
      );
    } else {
      await entityManager.save(
        chatRepository.create({
          userId: user.id,
          anonymous: input.anonymous,
          content: input.content,
        }),
      );
    }

    return {
      result: ErrorCode.SUCCESS,
    };
  }

  async deleteChat(
    input: DeleteChatInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    const chatRepository: ChatRepository =
      entityManager.getCustomRepository<ChatRepository>(ChatRepository);

    const chat = await chatRepository.findOne({
      id: input.chatId,
    });

    const postRepository: PostRepository =
      entityManager.getCustomRepository<PostRepository>(PostRepository);

    const post = await postRepository.findOne({
      id: chat.postId,
    });

    const spaceRepository: SpaceRepository =
      entityManager.getCustomRepository<SpaceRepository>(SpaceRepository);

    const space = await spaceRepository.findOne({
      id: post.spaceId,
      userId: user.id,
    });

    const spaceRoleRepository: SpaceRoleRepository =
      entityManager.getCustomRepository<SpaceRoleRepository>(
        SpaceRoleRepository,
      );

    const spaceRole = await spaceRoleRepository.findOne({
      id: space.spaceRoleId,
    });

    if (
      chat.userId !== user.id &&
      spaceRole.role === SpaceRoleType.PARTICIPANT
    ) {
      throw new NestException(ErrorCode.NOT_DELETE_CHAT);
    }

    await entityManager.save(
      chatRepository.update(
        {
          id: chat.id,
        },
        {
          status: ChatStatus.DELETED,
        },
      ),
    );

    return {
      result: ErrorCode.SUCCESS,
    };
  }
}
