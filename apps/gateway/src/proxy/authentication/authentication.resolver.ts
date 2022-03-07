import { ServiceType } from '@libs/common/constant';
import { AuthenticationInput } from '@libs/common/dto/authentication.input';
import { RegisterUserInput } from '@libs/common/dto/register-user.input';
import { NestException } from '@libs/common/model';
import { AuthenticationOutput } from '@libs/common/model/authentication.model';
import { RegisterUserOutput } from '@libs/common/model/register-user.output';
import { UserEntity } from '@libs/database/entities';
import { Logger } from '@nestjs/common';
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ScopedAuth } from '../../decorator/scoped-auth.decorator';
import { AuthenticationProxyService } from './authentication.proxy.service';

@Resolver('authentication')
export class AuthenticationResolver {
  private readonly logger: Logger;

  constructor(
    private readonly authenticationService: AuthenticationProxyService,
  ) {
    this.logger = new Logger('AuthenticationResolver');
  }

  @Query(() => AuthenticationOutput, {
    name: 'authenticate',
    description: '유저 로그인',
  })
  async authenticate(
    @Args({
      name: 'input',
      description: '로그인 정보 입력',
      type: () => AuthenticationInput,
    })
    input: AuthenticationInput,
  ): Promise<AuthenticationOutput> {
    try {
      this.logger.debug(input);
      return await this.authenticationService.authenticate({
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      throw NestException.processException(error);
    }
  }

  @Mutation(() => RegisterUserOutput)
  async registerUser(
    @Args('input') input: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    this.logger.debug(input);
    return await this.authenticationService.registerUser(input);
  }

  @ScopedAuth([ServiceType.USER])
  @Query(() => UserEntity)
  async findByUser(@Args('userId') userId: string): Promise<UserEntity> {
    this.logger.debug(userId);

    return await this.authenticationService.findByUser(userId);
  }
}
