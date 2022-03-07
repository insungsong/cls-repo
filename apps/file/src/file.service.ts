import { ErrorCode } from '@libs/common/constant';
import { RegisterFileInput } from '@libs/common/dto';
import { File, FileOutput } from '@libs/common/model/file.model';
import { FileEntity } from '@libs/database/entities/file.entity';
import { FileRepository } from '@libs/database/repository/file.repository';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class FileService {
  async registerFile(
    input: RegisterFileInput,
    entityManager: EntityManager,
  ): Promise<FileOutput> {
    const fileRespository: FileRepository =
      entityManager.getCustomRepository<FileRepository>(FileRepository);

    let file: FileEntity = fileRespository.create({
      id: input.id,
      s3Uri: input.s3Uri,
      fileName: input.fileName,
      fileExtension: input.fileExtension,
      fileMimetype: input.fileMimetype,
      filePath: input.filePath,
      description: input.description,
      size: input.size,
    });

    file = await fileRespository.save(file);

    return {
      result: ErrorCode.SUCCESS,
      data: {
        fileId: file.id,
        fileName: file.fileName,
        fileExtension: file.fileExtension,
        fileMimetype: file.fileMimetype,
        fileSize: file.size,
      } as File,
    } as FileOutput;
  }
}
