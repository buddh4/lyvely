import {
  FileValidator,
  FileTypeValidator,
  FileTypeValidatorOptions,
  MaxFileSizeValidator,
  MaxFileSizeValidatorOptions,
  ParseFileOptions,
  ParseFilePipe,
} from '@nestjs/common';

export class ParseFilePipeBuilder {
  private validators: FileValidator[] = [];

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

  build(additionalOptions?: Omit<ParseFileOptions, 'validators'>): ParseFilePipe {
    const parseFilePipe = new ParseFilePipe({
      ...additionalOptions,
      validators: this.validators,
    });

    this.validators = [];
    return parseFilePipe;
  }
}
