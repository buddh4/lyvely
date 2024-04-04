import {
  FileValidator,
  FileTypeValidatorOptions,
  MaxFileSizeValidatorOptions,
  ParseFileOptions,
  PipeTransform,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { type IFileInfo, type ImageMime, MimeTypeValidator } from '@/files';
import { ImageTransformationPipe } from '@/files/pipes/image-transformation.pipe';
import { IMAGE_MIME_TYPES } from '@/files/files.constants';

export class ImagePipeBuilder {
  private validatorOptions: Omit<ParseFileOptions, 'validators'>;
  private pipes: PipeTransform[] = [];
  private validators: FileValidator[] = [];
  private _maxWidth = 2500;
  private _mimeTypes: ImageMime[];

  addMaxSizeValidator(options: MaxFileSizeValidatorOptions) {
    return this.addValidator(new MaxFileSizeValidator(options));
  }

  addFileTypeValidator(options: FileTypeValidatorOptions) {
    return this.addValidator(new FileTypeValidator(options));
  }

  addValidator(validator: FileValidator) {
    this.validators.push(validator);
    return this;
  }

  mimeTypes(...mimeTypes: ImageMime[]) {
    this._mimeTypes = mimeTypes;
  }

  resize(width: number) {
    this._maxWidth = width;
    return this;
  }

  build(): PipeTransform<Express.Multer.File, Promise<IFileInfo>> {
    this.addValidator(new MimeTypeValidator({ type: this._mimeTypes || IMAGE_MIME_TYPES }));
    const parseFilePipe = new ParseFilePipe({
      ...this.validatorOptions,
      validators: this.validators,
    });

    const imageTransformer = new ImageTransformationPipe({
      maxWidth: this._maxWidth,
    });

    return {
      async transform(value: Express.Multer.File): Promise<IFileInfo> {
        await parseFilePipe.transform(value);
        return imageTransformer.transform(value);
      },
    };
  }
}
