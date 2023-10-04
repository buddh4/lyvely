import { BaseModel } from '@lyvely/common';

export class FileUploadResponse extends BaseModel<FileUploadResponse> {
  url: string;
  hash: string;
}
