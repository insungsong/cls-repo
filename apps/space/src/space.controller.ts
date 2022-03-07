import { RegisterSpaceInput } from '@libs/common/dto/register-space.input';
import { Output } from '@libs/common/model';
import { TransactionBlock } from '@libs/common/transaction/transaction';
import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SpaceService } from './space.service';
import { RegisterUserInput } from '@libs/common/dto';
import { ParticipateSpaceInput } from '@libs/common/dto/participate-space.input';
import { DeleteSpaceRoleInput } from '@libs/common/dto/delete-space-role.input';

@Controller()
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @MessagePattern({ cmd: 'registerSpace' })
  async registerSpace(@Payload() input: RegisterSpaceInput): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.spaceService.registerSpace(
          input as RegisterSpaceInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: 'participateSpace' })
  async participateSpace(
    @Payload() input: ParticipateSpaceInput,
  ): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.spaceService.participateSpace(
          input as ParticipateSpaceInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: 'deleteSpaceRole' })
  async deleteSpaceRole(
    @Payload() input: DeleteSpaceRoleInput,
  ): Promise<Output> {
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<Output> => {
        return await this.spaceService.deleteSpaceRole(
          input as DeleteSpaceRoleInput,
          entityManager,
        );
      },
    );
  }
}
