import { FileUpload } from '../models';
import { File } from '../schemas';
import { Readable } from 'node:stream';
import type { IStorageProvider } from './storage-provider.interface';
import type { Optional } from '@lyvely/common';

export interface IFileDownloadOptions {
  variant?: string;
}

export interface IFileDeleteOptions {
  variant?: string;
}

export type FileAccess = Optional<
  Pick<File, 'bucket' | 'variants' | 'guid' | 'region' | 'oid' | 'pid'>,
  'region'
>;

/**
 * Interface representing a central storage service responsible for storing, persisting, deleting files.
 *
 * Note: A storage service is not responsible for access control of files.
 */
export interface IStorageService {
  /**
   * Uploads a file to the specified bucket and persists and returns a file instance.
   *
   * Note: This service does not apply any access control.
   *
   * @param {FileUpload} upload - The file to be uploaded.
   * @returns {Promise<File>} - A Promise that resolves to the uploaded File object.
   */
  upload(upload: FileUpload): Promise<File>;

  /**
   * Downloads a file from the specified bucket using the provided GUID and variation.
   *
   * Note: This service does not apply any access control.
   *
   * @param {File} file - The file instance to be downloaded.
   * @param {IFileDownloadOptions} options - (Optional) Download options.
   * @returns {Readable | undefined} - A readable stream representing the downloaded file or null if the file or variant could not be found.
   */
  download(file: FileAccess, options?: IFileDownloadOptions): Promise<Readable | null>;

  /**
   * Deletes an item from the specified bucket and variant (if provided) using the given GUID.
   *
   * Note: This service does not apply any access control.
   *
   * @param {File} file - The file instance to be deleted.
   * @param {IFileDeleteOptions} options - (Optional) Delete options.
   * @return {Promise<void>} A Promise that resolves when the item is successfully deleted or rejects with an error if deletion fails.
   */
  delete(file: FileAccess, options?: IFileDeleteOptions): Promise<void>;
}
