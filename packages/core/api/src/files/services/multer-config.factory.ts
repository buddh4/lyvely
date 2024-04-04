import type { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageProvider } from '../providers';
import { join } from 'path';
import { STORAGE_BUCKET_UPLOADS } from '../files.constants';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class MulterConfigFactory implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    const dest = MulterConfigFactory.getUploadDirectoryPath(this.configService);
    return {
      dest,
      limits: this.getLimits(),
    };
  }

  static getUploadDirectoryPath(configService: ConfigService) {
    const config = configService.get('files.storage.upload');
    return config?.dest || join(LocalStorageProvider.getDefaultRoot(), STORAGE_BUCKET_UPLOADS);
  }

  protected getLimits(): MulterOptions['limits'] {
    return {
      fileSize: this.configService.get('files.upload.limits') || 1024 * 1024 * 1024, // 1GB
      files: 1,
      parts: 10,
    };
  }
}
