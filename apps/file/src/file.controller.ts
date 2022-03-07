import { RegisterFileInput } from '@libs/common/dto';
import { FileOutput } from '@libs/common/model/file.model';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileService } from './file.service';
import { getConnection, EntityManager } from 'typeorm';
import { NestException } from '@libs/common/model';
@Controller()
export class FileController {
  private readonly logger: Logger;
  constructor(private readonly fileService: FileService) {
    this.logger = new Logger('FileController');
  }

  @MessagePattern({ cmd: 'registerFile' })
  async registerFile(@Payload() input: RegisterFileInput): Promise<FileOutput> {
    this.logger.debug(input);
    const queryRunner = getConnection().createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const entityManager: EntityManager = queryRunner.manager;
      const result = await this.fileService.registerFile(input, entityManager);
      await queryRunner.commitTransaction();
      this.logger.debug(input);
      return result;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      return NestException.processException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
