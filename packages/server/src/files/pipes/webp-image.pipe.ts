import { Injectable, PipeTransform } from '@nestjs/common';
import path from 'path';
import sharp from 'sharp';

@Injectable()
export class WebPPipe implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>> {
  constructor(private maxWidth?: number, private effort = 3) {}

  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    debugger;
    return image;
    /*const originalName = path.parse(image.originalname).name;
    const filename = Date.now() + '-' + originalName + '.webp';

    if (this.maxWidth) {
      await sharp(image.buffer).resize(800).webp({ effort: 3 }).toFile(path.join('uploads', filename));
    } else {
      await sharp(image.buffer).webp({ effort: 3 }).toFile(path.join('uploads', filename));
    }

    return filename;*/
  }
}
