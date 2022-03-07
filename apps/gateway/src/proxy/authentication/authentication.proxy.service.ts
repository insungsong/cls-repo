import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SayHelloOuput } from '@libs/common/model/say-hello.output';
import { lastValueFrom } from 'rxjs';
import { RegisterUserInput, SayHelloInput } from '@libs/common/dto';
import { NestException, RegisterUserOutput } from '@libs/common/model';
import { AuthenticationInput } from '@libs/common/dto/authentication.input';
import { AuthenticationOutput } from '@libs/common/model/authentication.model';
import { UserEntity } from '@libs/database/entities';

@Injectable()
export class AuthenticationProxyService {
  private readonly logger: Logger;

  constructor(@Inject('AUTHENTICATION_SERVICE') private client: ClientProxy) {
    this.logger = new Logger('AuthenticationProxyService');
  }

  async authenticate(
    input: AuthenticationInput,
  ): Promise<AuthenticationOutput> {
    try {
      return await lastValueFrom(
        this.client.send<AuthenticationOutput, AuthenticationInput>(
          { cmd: 'authenticate' },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw NestException.processException(error);
    }
  }

  async registerUser(input: RegisterUserInput): Promise<RegisterUserOutput> {
    this.logger.debug(input);
    return await lastValueFrom(
      this.client.send<RegisterUserOutput>({ cmd: 'registerUser' }, input),
    );
  }

  async findByUser(userId: string): Promise<UserEntity> {
    this.logger.debug(userId);

    return await lastValueFrom(
      this.client.send<UserEntity>({ cmd: 'findByUser' }, userId),
    );
  }
}
