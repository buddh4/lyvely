import { Injectable, PipeTransform, BadRequestException, Logger } from '@nestjs/common';
import { LyvelyConfigService } from '@/config';
import type { FilesModuleConfig } from '../interfaces';
import { MimeTypeValidator } from '../validators';

@Injectable()
export class ConfigurableFileValidationPipe implements PipeTransform {
  private logger = new Logger('ConfigurableFileValidationPipe');

  constructor(private readonly configService: LyvelyConfigService<FilesModuleConfig>) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { upload } = this.configService.getModuleConfig('files');

    if (!upload) {
      this.logger.warn('No upload configuration found. Skipping file validation...');
      return file;
    }

    if ((upload.allowedMimeTypes?.length ?? 0) > 0) {
      const mimeTypeValidator = new MimeTypeValidator({ type: upload.allowedMimeTypes! });
      if (!mimeTypeValidator.isValid(file)) {
        throw new BadRequestException(
          `Invalid file type. Allowed: ${upload.allowedMimeTypes!.join(', ')}`
        );
      }
    }

    if (typeof upload.maxSizeInBytes === 'number' && file.size > upload.maxSizeInBytes) {
      throw new BadRequestException(
        `File too large. Max allowed size is ${Math.round(upload.maxSizeInBytes / 1024 / 1024)}MB`
      );
    }

    return file;
  }
}
