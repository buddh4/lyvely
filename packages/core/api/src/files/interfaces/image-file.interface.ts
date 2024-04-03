import type { IFile, IFileVariant } from './file.interface';
import type { IFileMetadata } from './file-meta.interface';

export interface ImageMetadataIf extends IFileMetadata {
  height: number;
  width: number;
}

export interface ImageFileVariant<TID = string> extends IFileVariant<TID, ImageMetadataIf> {}

export interface ImageFileIf<TID = string>
  extends IFile<TID, ImageMetadataIf, ImageFileVariant<TID>> {}
