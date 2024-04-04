import type { IFile } from './file.interface';
import type { IFileUpload } from './file-upload.interface';
import type { TObjectId } from '@/core';

export interface IFileTypeDefinition<TFile extends IFile<TObjectId> = IFile<TObjectId>> {
  metaFactory(upload: IFileUpload<TFile>): Promise<TFile['meta']>;
}
