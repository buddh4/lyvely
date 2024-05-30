import type { FileAccess, IStorageProvider } from '../interfaces';
import type { ModuleRef } from '@nestjs/core';
import type { FileUpload } from '../models/file-upload.model';
import stream from 'node:stream';

/**
 * This abstract class serves as base class for all storage providers.
 *
 * @template TOptions - The type of options for the storage provider.
 */
export abstract class StorageProvider<TOptions> implements IStorageProvider {
  constructor(
    public readonly id: string,
    protected options: TOptions,
    protected moduleRef: ModuleRef
  ) {}

  /**
   * Uploads a file to the bucket and guid of the upload file.
   *
   * @param {FileUpload} upload - The file to be uploaded.
   * @returns {Promise<File>} - A promise that resolves with the uploaded file.
   */
  abstract upload(upload: FileUpload): Promise<void>;

  /**
   * Assures that a given file is deleted from storage.
   *
   * @param {FileAccess} file - The file to be deleted.
   * @return {Promise<void>} A Promise that resolves with no value upon successful deletion.
   */
  abstract delete(file: FileAccess): Promise<void>;

  /**
   * Loads a file from storage if existing.
   *
   * @param {FileAccess} file - The file to download.
   * @returns {Promise<stream.Readable | null>} A promise that resolves with a readable stream if the download is
   * successful, or null if the download fails.
   */
  abstract download(file: FileAccess): Promise<stream.Readable | null>;

  /**
   * May run provider specific initialization logic.
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  abstract initialize(): Promise<void>;
}
