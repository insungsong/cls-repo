import { NestException } from '@libs/common/model';
import { FileOutput } from '@libs/common/model/file.model';
import {
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FileProxyService } from './file.proxy.service';

@Controller('file')
export class FileController {
  private readonly logger: Logger;

  constructor(private readonly fileProxyService: FileProxyService) {
    this.logger = new Logger('FileController');
  }
  /**
   * upload
   * @param file
   * @returns {Promise<CAPAFileOutput>}
   */
  @ApiOperation({
    summary: 'Upload a file',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'form-data')
  @ApiResponse({ type: () => FileOutput })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileOutput> {
    try {
      const result = await this.fileProxyService.upload(file);

      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw new NestException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
