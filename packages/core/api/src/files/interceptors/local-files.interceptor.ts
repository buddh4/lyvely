import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { ConfigurationPath } from '@/core';
import { Request } from 'express';
import { getLocalUploadFilePath } from '../file-path.utils';

interface LocalFilesInterceptorOptions {
  dir?: string;
  filename?(req: Request, configService: ConfigService, file: Express.Multer.File): string;
}

export function LocalFilesInterceptor(
  fieldName: string,
  options: LocalFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService<ConfigurationPath>) {
      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: (
            req: Request,
            file: Express.Multer.File,
            callback: (error: Error | null, destination: string) => void,
          ) => callback(null, getLocalUploadFilePath(configService, options.dir || '')),
          filename: options.filename
            ? (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void,
              ) => callback(null, options.filename!(req, configService, file))
            : undefined,
        }),
      };

      this.fileInterceptor = new (FileInterceptor(fieldName, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}
