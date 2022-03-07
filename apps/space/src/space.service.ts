import { ErrorCode } from '@libs/common/constant';
import { SpaceRoleStatus } from '@libs/common/constant/space-role-status.type';
import { SpaceRoleType } from '@libs/common/constant/space-role.type';
import { SpaceStatusType } from '@libs/common/constant/space-status.type';
import { DeleteSpaceRoleInput } from '@libs/common/dto/delete-space-role.input';
import { ParticipateSpaceInput } from '@libs/common/dto/participate-space.input';
import { RegisterSpaceInput } from '@libs/common/dto/register-space.input';
import { NestException, Output } from '@libs/common/model';
import { UserRepository } from '@libs/database/repository';
import { SpaceRoleRepository } from '@libs/database/repository/space-role.repository';
import { SpaceRepository } from '@libs/database/repository/space.repository';
import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class SpaceService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger('SpaceService');
  }
  async registerSpace(
    input: RegisterSpaceInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    this.logger.debug('input:', input);
    /*
    1. 공간 개설 시, 이름과 로고, 공간 내에서 사용할 역할(SpaceRole)을 함께 설정할 수 있습니다.
    2. 사용자는 자유롭게 공간을 개설하거나, 다른 공간에 참여할 수 있습니다.
    3. 공간을 개설할 경우, 개설자는 관리자가 되며 공간은 오로지 개설자만 삭제할 수 있습니다.
    4. 개설된 공간은 관리자용 입장 코드와 참여자용 입장 코드를 가집니다.
        1. 코드는 영문 + 숫자의 조합으로 구성된 8자리 문자열입니다.
    5. 사용자는 4.의 입장 코드를 통해 공간에 참여할 수 있습니다. 이 때 권한은 사용한 코드에 따라 결정됩니다.
    */
    const userRepository: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    const managerCode = Math.random().toString(36).substr(2, 8);

    const participantCode = Math.random().toString(36).substr(2, 8);

    const spaceRepsitory: SpaceRepository =
      entityManager.getCustomRepository<SpaceRepository>(SpaceRepository);

    const space = await spaceRepsitory
      .create({
        name: input.name,
        logo: input.logo,
        userId: user.id,
        managerCode: managerCode,
        participantCode: participantCode,
        status: SpaceStatusType.SPACE,
      })
      .save();

    if (!space) {
      throw new NestException(ErrorCode.NOT_REGISTER_SPACE);
    }

    const spaceRoleRepository: SpaceRoleRepository =
      entityManager.getCustomRepository<SpaceRoleRepository>(
        SpaceRoleRepository,
      );

    const spaceRoleBucket = input.spaceRole;

    //관리자 default 생성 타입(ADMIN)
    const adminSpaceRole = await spaceRoleRepository
      .create({
        spaceId: space.id,
        role: SpaceRoleType.ADMIN,
      })
      .save();

    //관리자가 따로 생성한 유저 타입 List
    await Promise.all(
      spaceRoleBucket.map((spaceRole) => {
        return spaceRoleRepository
          .create({
            spaceId: space.id,
            role: spaceRole.role,
          })
          .save();
      }),
    );

    await spaceRepsitory.update(
      {
        id: space.id,
      },
      {
        spaceRoleId: adminSpaceRole.id,
      },
    );

    return {
      result: ErrorCode.SUCCESS,
    };
  }

  async participateSpace(
    input: ParticipateSpaceInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    const spaceRepository: SpaceRepository =
      entityManager.getCustomRepository<SpaceRepository>(SpaceRepository);

    const space = await spaceRepository.findOne({
      id: input.spaceId,
      status: SpaceStatusType.SPACE,
    });

    if (!space) {
      throw new NestException(ErrorCode.NOT_FOUND_SPACE);
    }

    const isExistSpace = await spaceRepository.findOne({
      id: input.spaceId,
      userId: user.id,
    });

    if (isExistSpace) {
      throw new NestException(ErrorCode.IS_EXIST_SPACE);
    }

    if (input.managerCode && input.managerCode !== space.managerCode) {
      throw new NestException(ErrorCode.NOT_COMPARE_MANAGER_CODE);
    }

    if (input.participantCode && input.managerCode !== space.participantCode) {
      throw new NestException(ErrorCode.NOT_COMPARE_PARTICIPANT_CODE);
    }

    const spaceRoleRepository: SpaceRoleRepository =
      entityManager.getCustomRepository<SpaceRoleRepository>(
        SpaceRoleRepository,
      );

    const spaceManagerRole = await spaceRoleRepository.findOne({
      spaceId: space.id,
      role: SpaceRoleType.MANAGER,
    });
    const spaceParticipantRole = await spaceRoleRepository.findOne({
      spaceId: space.id,
      role: SpaceRoleType.PARTICIPANT,
    });

    if (input.managerCode) {
      await spaceRepository
        .create({
          parentsSpaceId: space.id,
          userId: user.id,
          status: SpaceStatusType.PARTICIPANT,
          spaceRoleId: spaceManagerRole.id,
        })
        .save();
    } else {
      await spaceRepository
        .create({
          parentsSpaceId: space.id,
          userId: user.id,
          status: SpaceStatusType.PARTICIPANT,
          spaceRoleId: spaceParticipantRole.id,
        })
        .save();
    }

    return {
      result: ErrorCode.SUCCESS,
    };
  }

  async deleteSpaceRole(
    input: DeleteSpaceRoleInput,
    entityManager: EntityManager,
  ): Promise<Output> {
    const userRepository: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    const user = await userRepository.findRegisteredUserByEmail(input.email);

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    const spaceRoleRepository: SpaceRoleRepository =
      entityManager.getCustomRepository<SpaceRoleRepository>(
        SpaceRoleRepository,
      );

    const spaceRole = await spaceRoleRepository.findOne({
      id: input.spaceRoleId,
    });

    const spaceRepsitory: SpaceRepository =
      entityManager.getCustomRepository<SpaceRepository>(SpaceRepository);

    const space = await spaceRepsitory.findOne({
      id: spaceRole.spaceId,
    });

    //1. 이걸 삭제하려는 유저가, 파트장인지 확인해야함
    if (user.id !== space.userId || space.status !== SpaceStatusType.SPACE) {
      throw new NestException(ErrorCode.NOT_MATCHING_ADMIN_USER);
    }

    if (spaceRole.role === SpaceRoleType.ADMIN) {
      throw new NestException(ErrorCode.ADMIN_ROLE_CANNOT_BE_DELETED);
    }

    //2. 파트장이 맞다면 삭제 아니면 에러
    await spaceRoleRepository.update(
      {
        id: input.spaceRoleId,
      },
      {
        status: SpaceRoleStatus.DELETED,
      },
    );

    return {
      result: ErrorCode.SUCCESS,
    };
  }
}
