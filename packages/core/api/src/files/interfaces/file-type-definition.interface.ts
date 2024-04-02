import type { IFile, IFileUpload } from '../interfaces';
import type { TObjectId } from '@/core';

export interface IFileTypeDefinition<TFile extends IFile<TObjectId> = IFile<TObjectId>> {
  metaFactory(upload: IFileUpload<TFile>): Promise<TFile['meta']>;
}
