import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    return {
      storage: diskStorage({
        destination: '/tmp',
        filename: (req, file, cb) => {
          const { originalname } = file as Express.Multer.File;
          const ext: string = originalname.split('.').pop();
          const filename = `${v4()}.${ext}`;
          cb(null, filename);
        },
      }),
    };
  }
}
