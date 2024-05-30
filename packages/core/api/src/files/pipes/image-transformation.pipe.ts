import { Injectable, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';
import type { IFileInfo } from '../interfaces';
import { isMemoryFile } from '../helpers';

export interface ImageResizePipeOptionsIF {
  maxWidth?: number;
}

@Injectable()
export class ImageTransformationPipe implements PipeTransform<IFileInfo, Promise<IFileInfo>> {
  options: ImageResizePipeOptionsIF;

  constructor(options: ImageResizePipeOptionsIF) {
    this.options = options;
  }

  async transform(image: IFileInfo): Promise<IFileInfo> {
    const transform = this.initSharp(image);

    if (this.options.maxWidth) {
      transform.resize({ width: this.options.maxWidth, withoutEnlargement: true });
    }

    transform.webp();

    const { originalname, mimetype, size } = image;

    if (isMemoryFile(image)) {
      return {
        originalname,
        mimetype,
        size,
        buffer: await transform.toBuffer(),
      };
    }

    const transformedPath = `${image.path}-${Date.now()}`;

    await transform.toFile(transformedPath);
    return {
      originalname,
      mimetype,
      size,
      path: transformedPath,
    };
  }

  private initSharp(image: IFileInfo): sharp.Sharp {
    if (isMemoryFile(image)) {
      return sharp(image.buffer);
    }

    return sharp(image.path);
  }
}
