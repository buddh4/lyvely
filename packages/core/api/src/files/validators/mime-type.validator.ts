import { FileValidator } from '@nestjs/common';

export type MimeTypeValidatorOptions = {
  type: string | Array<string>;
};

const dynamicImport = async (packageName: string) => new Function(`return import('${packageName}')`)();

export class MimeTypeValidator extends FileValidator<MimeTypeValidatorOptions> {
  buildErrorMessage(): string {
    return `Validation failed (expected mime type ${this.validationOptions.type})`;
  }

  public async isValid(file: Express.Multer.File): Promise<boolean> {
    if (!this.validationOptions?.type?.length) {
      return true;
    }

    if (!file.path && !file.buffer) {
      return false;
    }

    const ft = await dynamicImport('file-type');

    const fileType = file.buffer ? await ft.fileTypeFromBuffer(file.buffer) : await ft.fileTypeFromFile(file.path);
    return Array.isArray(this.validationOptions.type)
      ? this.validationOptions.type.includes(fileType.mime)
      : this.validationOptions.type === fileType.mime;
  }
}
