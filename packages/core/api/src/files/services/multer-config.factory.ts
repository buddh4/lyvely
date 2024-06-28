import type { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { Injectable } from '@nestjs/common';
import { LocalStorageProvider } from '../providers';
import { join } from 'path';
import { STORAGE_BUCKET_UPLOADS } from '../files.constants';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { LyvelyConfigService } from '@/config';
import type { FilesModuleConfig } from '@/files/interfaces';

@Injectable()
export class MulterConfigFactory implements MulterOptionsFactory {
  constructor(private readonly configService: LyvelyConfigService<FilesModuleConfig>) {}

  createMulterOptions(): MulterModuleOptions {
    const dest = MulterConfigFactory.getUploadDirectoryPath(this.configService);
    return {
      dest,
      limits: this.getLimits(),
    };
  }

  static getUploadDirectoryPath(configService: LyvelyConfigService): string {
    return configService.getModuleConfig<string>(
      'files',
      'upload.dest',
      join(LocalStorageProvider.getDefaultRoot(), STORAGE_BUCKET_UPLOADS)
    );
  }

  protected getLimits(): MulterOptions['limits'] {
    return {
      fileSize: this.configService.getModuleConfig(
        'files',
        'upload.limits.fileSize',
        1024 * 1024 * 1024
      ),
      files: 1,
      parts: 10,
    };
  }
}
