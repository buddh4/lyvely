import type { IFile, IFileVariant } from './file.interface';
import type { IFileMetadata } from './file-meta.interface';

export interface ImageMetadataIF extends IFileMetadata {
  height: number;
  width: number;
}

export interface ImageFileVariantIF<TID = string> extends IFileVariant<TID, ImageMetadataIF> {}

export interface ImageFileIF<TID = string>
  extends IFile<TID, ImageMetadataIF, ImageFileVariantIF<TID>> {}
