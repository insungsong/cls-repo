import { NestConfigService } from '@libs/common/config/nest-config.service';
import { ErrorCode, ServiceType } from '@libs/common/constant';
import { RegisterUserInput, SayHelloInput } from '@libs/common/dto';
import { AuthenticationInput } from '@libs/common/dto/authentication.input';
import { Payload } from '@libs/common/interface/jwt.paylod.interface';
import {
  NestException,
  RegisterUserOutput,
  SayHelloOuput,
} from '@libs/common/model';
import {
  Authentication,
  AuthenticationOutput,
} from '@libs/common/model/authentication.model';
import { UserEntity } from '@libs/database/entities';
import { UserRepository } from '@libs/database/repository';
import { FileRepository } from '@libs/database/repository/file.repository';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: NestConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async getHello(input: SayHelloInput): Promise<SayHelloOuput> {
    return { value: input.value } as SayHelloOuput;
  }

  async createAccessToken(
    user: UserEntity,
    now: dayjs.Dayjs,
    exp: dayjs.Dayjs,
    service: ServiceType,
  ): Promise<string> {
    const scopes: ServiceType[] = [];

    if (user != null) {
      scopes.push(ServiceType.USER);
    }

    return jwt.sign(
      {
        iss: 'nest-server.com',
        sub: 'access',
        iat: now.unix(),
        exp: exp.unix(),
        aud: user.email,
        scope: service,
        scopes: scopes,
      } as Payload,
      this.configService.jwtSecret,
    );
  }

  async authenticate(
    input: AuthenticationInput,
    entityManager: EntityManager,
  ): Promise<AuthenticationOutput> {
    const userRepository: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    const user: UserEntity = await userRepository.findRegisteredUserByEmail(
      input.email,
    );
    if (user == null) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    if ((await argon2.verify(user.password, input.password)) === false) {
      throw new NestException(ErrorCode.PASSWORD_INCORRECT);
    }

    const now = dayjs();
    const exp = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    return {
      result: ErrorCode.SUCCESS,
      data: {
        accessToken: await this.createAccessToken(
          user,
          now,
          exp,
          input.service,
        ),
        tokenType: 'Bearer',
        expiresIn: exp.unix(),
        refreshToken: await this.createRefreshToken(user, now, input.service),
      } as Authentication,
    } as AuthenticationOutput;
  }

  async registerUser(
    input: RegisterUserInput,
    entityManager: EntityManager,
  ): Promise<RegisterUserOutput> {
    const userRepository: UserRepository =
      entityManager.getCustomRepository<UserRepository>(UserRepository);

    let user: UserEntity = await userRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (user) {
      throw new NestException(ErrorCode.DUPLICATE_EMAIL);
    }

    if (input.password !== input.passwordConfirm) {
      throw new NestException(ErrorCode.NOT_DUPLICATE_PASSWORD);
    }

    const fileRepository: FileRepository =
      entityManager.getCustomRepository<FileRepository>(FileRepository);

    if (input.fileId) {
      const file = await fileRepository.findOne({
        id: input.fileId,
      });

      if (!file) {
        throw new NestException(ErrorCode.PROFILE_NOT_FOUNT);
      }
    }

    user = await userRepository
      .create({
        email: input.email,
        password: await argon2.hash(input.password),
        fileId: input.fileId,
        firstName: input.firstName,
        lastName: input.lastName,
      })
      .save();

    const now = dayjs();
    const exp = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    return {
      result: ErrorCode.SUCCESS,
      data: {
        accessToken: await this.createAccessToken(
          user,
          now,
          exp,
          input.service,
        ),
        tokenType: 'Bearer',
        expiresIn: exp.unix(),
        refreshToken: await this.createRefreshToken(user, now, input.service),
      } as Authentication,
    } as AuthenticationOutput;
  }

  async findByUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new NestException(ErrorCode.NOT_FOUND_USER);
    }

    return user;
  }

  async createRefreshToken(
    user: UserEntity,
    iat: dayjs.Dayjs,
    service: ServiceType,
  ): Promise<string> {
    return jwt.sign(
      {
        iss: 'capa.ai',
        sub: 'refresh',
        iat: iat.unix(),
        exp: iat
          .add(
            this.configService.refreshTokenExprieTimeValue,
            this.configService.refreshTokenExpireTimeUnit,
          )
          .unix(),
        aud: user.email,
        scope: service,
      } as Payload,
      this.configService.jwtSecret,
    );
  }
}
