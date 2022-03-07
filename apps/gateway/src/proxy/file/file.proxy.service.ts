import { NestConfigService } from '@libs/common/config/nest-config.service';
import { RegisterFileInput } from '@libs/common/dto';
import { FileOutput } from '@libs/common/model/file.model';
import {
  HttpException,
  HttpService,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AWSError, S3 } from 'aws-sdk';
import { createReadStream, ReadStream } from 'fs';
import { lastValueFrom } from 'rxjs';

/**
 * FileProxyService
 */
@Injectable()
export class FileProxyService {
  private readonly logger: Logger;

  constructor(
    private readonly config: NestConfigService,
    @Inject('FILE_SERVICE') private fileClient: ClientProxy,
  ) {
    this.logger = new Logger('FileProxyService');
  }

  /**
   * s3Instance
   *
   * @returns {S3}
   */
  get s3Instance(): S3 {
    return new S3({
      accessKeyId: this.config.awsAccessKey,
      secretAccessKey: this.config.awsSecretAccessKey,
    } as S3.Types.ClientConfiguration);
  }

  async upload(file: Express.Multer.File): Promise<FileOutput> {
    const { filename, originalname, mimetype, size, path } =
      file as Express.Multer.File;

    const stream: ReadStream = createReadStream(path);
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.config.awsS3BucketKey,
      Key: filename.split('.')[0],
      Body: stream,
    } as S3.Types.PutObjectRequest;

    const input: RegisterFileInput = await this.s3Instance
      .upload(params)
      .promise()
      .then(
        (data: S3.ManagedUpload.SendData): RegisterFileInput =>
          ({
            id: data.Key,
            s3Uri: data.Key,
            fileName: originalname,
            fileExtension: originalname.split('.').pop(),
            fileMimetype: mimetype,
            filePath: '/',
            description: null,
            size: size,
          } as RegisterFileInput),
      )
      .catch((error: AWSError) => {
        this.logger.error(error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });

    return await this.registerFile(input);
  }

  async registerFile(input: RegisterFileInput): Promise<FileOutput> {
    return await lastValueFrom(
      this.fileClient.send<FileOutput, RegisterFileInput>(
        { cmd: 'registerFile' },
        input,
      ),
    );
  }
}
