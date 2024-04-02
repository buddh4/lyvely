import { FileUpload } from '../models/file-upload.model';
import { Readable } from 'node:stream';
import type { FileAccess } from './storage-service.interface';

/**
 * Interface for storage provider.
 * @interface
 */
export interface IStorageProvider {
  readonly id: string;

  /**
   * Uploads a file to storage.
   *
   * @param {FileUpload} upload - The file upload object containing the file to be uploaded.
   * @return {Promise<void>} - A Promise that resolves when the upload is completed successfully.
   */
  upload(upload: FileUpload): Promise<void>;

  /**
   * Deletes the given file from storage.
   *
   * @param {IBaseFile<TObjectId>} file - The file to be deleted.
   * @return {Promise<void>} A promise that resolves when the file is deleted successfully.
   */
  delete(file: FileAccess): Promise<void>;

  /**
   * Loads the given file from storage.
   *
   * @param {IBaseFile<TObjectId>} file - The file to download.
   * @returns {Promise<Readable | null>} A promise that resolves to a Readable stream containing the downloaded file data, or `null` if the download failed.
   */
  download(file: FileAccess): Promise<Readable | null>;
}
