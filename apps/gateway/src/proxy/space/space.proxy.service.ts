import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SayHelloOuput } from '@libs/common/model/say-hello.output';
import { lastValueFrom } from 'rxjs';
import { RegisterUserInput, SayHelloInput } from '@libs/common/dto';
import { NestException, Output, RegisterUserOutput } from '@libs/common/model';
import { UserEntity } from '@libs/database/entities';
import { RegisterSpaceInput } from '@libs/common/dto/register-space.input';
import { ParticipateSpaceInput } from '@libs/common/dto/participate-space.input';
import { DeleteSpaceRoleInput } from '@libs/common/dto/delete-space-role.input';

@Injectable()
export class SpaceProxyService {
  private readonly logger: Logger;

  constructor(@Inject('SPACE_SERVICE') private client: ClientProxy) {
    this.logger = new Logger('SpaceProxyService');
  }

  async registerSpace(input: RegisterSpaceInput): Promise<Output> {
    this.logger.debug(input);

    return await lastValueFrom(
      this.client.send<Output>({ cmd: 'registerSpace' }, input),
    );
  }

  async participateSpace(input: ParticipateSpaceInput): Promise<Output> {
    this.logger.debug(input);

    return await lastValueFrom(
      this.client.send<Output>({ cmd: 'participateSpace' }, input),
    );
  }

  async deleteSpaceRole(input: DeleteSpaceRoleInput): Promise<Output> {
    return await lastValueFrom(
      this.client.send<Output>({ cmd: 'deleteSpaceRole' }, input),
    );
  }
}
