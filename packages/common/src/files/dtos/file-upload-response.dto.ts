import { BaseModel } from '@lyvely/core';

export class FileUploadResponse extends BaseModel<FileUploadResponse> {
  url: string;
  hash: string;
}
