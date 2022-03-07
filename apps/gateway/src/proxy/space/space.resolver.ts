import { ErrorCode, ServiceType } from '@libs/common/constant';
import { DeleteSpaceRoleInput } from '@libs/common/dto/delete-space-role.input';
import { ParticipateSpaceInput } from '@libs/common/dto/participate-space.input';
import { RegisterSpaceInput } from '@libs/common/dto/register-space.input';
import { Output } from '@libs/common/model';
import { Logger, Scope } from '@nestjs/common';
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ScopedAuth } from '../../decorator/scoped-auth.decorator';
import { CurrentUser } from '../../decorator/user.decorator';
import { SpaceProxyService } from './space.proxy.service';

@Resolver('space')
export class SpaceResolver {
  private readonly logger: Logger;

  constructor(private readonly spaceProxyService: SpaceProxyService) {
    this.logger = new Logger('SpaceResolver');
  }

  @ScopedAuth([ServiceType.USER])
  @Mutation(() => Output, { description: 'Space 개설' })
  async registerSpace(
    @CurrentUser() user: any,
    @Args('input') input: RegisterSpaceInput,
  ) {
    return await this.spaceProxyService.registerSpace({
      email: user.email,
      ...input,
    });
  }

  @ScopedAuth([ServiceType.USER])
  @Mutation(() => Output, { description: '개설된 Space 참여' })
  async participateSpace(
    @CurrentUser() user: any,
    @Args('input') input: ParticipateSpaceInput,
  ): Promise<Output> {
    return await this.spaceProxyService.participateSpace({
      email: user.email,
      ...input,
    });
  }

  @ScopedAuth([ServiceType.USER])
  @Mutation(() => Output, { description: '관리자의 역할 삭제' })
  async deleteSpaceRole(
    @CurrentUser() user: any,
    @Args('input') input: DeleteSpaceRoleInput,
  ) {
    return await this.spaceProxyService.deleteSpaceRole({
      email: user.email,
      ...input,
    });
  }
}
