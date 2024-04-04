import { Injectable, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';
import { isNil } from '@lyvely/common';
import type { IFileInfo } from '@/files';

export interface ImageResizePipeOptionsIF {
  maxWidth?: number;
}

@Injectable()
export class ImageTransformationPipe
  implements PipeTransform<Express.Multer.File, Promise<IFileInfo>>
{
  options: ImageResizePipeOptionsIF;

  constructor(options: ImageResizePipeOptionsIF) {
    this.options = options;
  }

  async transform(image: Express.Multer.File): Promise<IFileInfo> {
    const transform = this.initSharp(image);

    if (this.options.maxWidth) {
      transform.resize({ width: this.options.maxWidth, withoutEnlargement: true });
    }

    transform.webp();

    const { originalname, mimetype, size, path } = image;

    if ('buffer' in image && !isNil(image.buffer)) {
      return {
        originalname,
        mimetype,
        size,
        buffer: await transform.toBuffer(),
      };
    }

    await transform.toFile(`${image.path}-${Date.now()}`);
    return {
      originalname,
      mimetype,
      size,
      path,
    };
  }

  private initSharp(image: Express.Multer.File): sharp.Sharp {
    if ('buffer' in image && !isNil(image.buffer)) {
      return sharp(image.buffer);
    }

    return sharp(image.path);
  }
}
