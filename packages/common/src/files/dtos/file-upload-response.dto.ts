import { BaseModel } from '@/models';

export class FileUploadResponse extends BaseModel<FileUploadResponse> {
  url: string;
  hash: string;
}
