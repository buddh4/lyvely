import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { ConfigurationPath, LyvelyAppConfiguration } from '@/core';
import { NestedPaths } from '@lyvely/common';
import { join } from 'path';
import { UserRequest } from '@/users';
import { Request } from 'express';

interface LocalFilesInterceptorOptions {
  configPath: NestedPaths<LyvelyAppConfiguration>;
  fieldName: string;
  filename?(req: Request, configService: ConfigService, file: Express.Multer.File): string;
  destination?(req: Request, configService: ConfigService, file: Express.Multer.File): string;
}

export function LocalFilesInterceptor(options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService<ConfigurationPath>) {
      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: options.destination
            ? (
                req: UserRequest,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void,
              ) => callback(null, options.destination?.(req, configService, file) || join(process.cwd(), 'uploads'))
            : undefined,
          filename: options.filename
            ? (
                req: UserRequest,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void,
              ) => callback(null, options.filename?.(req, configService, file))
            : undefined,
        }),
      };

      this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}
