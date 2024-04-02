import type { IFileMetadata } from './file-meta.interface';

/**
 * Represents base file data shared between files and file variants.
 */
export interface IBaseFile<TID = string, TMeta extends IFileMetadata = IFileMetadata> {
  bucket: string;
  region: string;
  guid: string;
  meta: TMeta;
  createdBy: TID;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a base file variant
 */
export interface IFileVariant<TID = string, TMeta extends IFileMetadata = IFileMetadata>
  extends IBaseFile<TID, TMeta> {
  fguid: string;
  variant: string;
}

/**
 * Represents the basic schema for files.
 */
export interface IFile<
  TID = string,
  TMeta extends IFileMetadata = IFileMetadata,
  TVariant extends IFileVariant<TID, TMeta> = IFileVariant<TID, TMeta>,
> extends IBaseFile<TID, TMeta> {
  id: string;
  oid?: TID;
  pid?: TID;

  meta: TMeta;
  variants?: TVariant[];
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
