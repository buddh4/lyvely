import type { ModuleRef } from '@nestjs/core';
import { StorageProvider } from './storage.provider';
import { join } from 'path';
import type { FileUpload } from '../models';
import { isGuid } from '@lyvely/common';
import { IntegrityException } from '@lyvely/interface';
import fs from 'node:fs';
import { REGEX_STORAGE_BUCKET } from '../files.constants';
import { unlink, access, writeFile, mkdir } from 'node:fs/promises';
import type { Readable } from 'node:stream';
import type { FileAccess } from '../interfaces';
import { ConfigService } from '@nestjs/config';

export interface ILocalStorageProviderOptions {
  root?: string;
}

/**
 * The LocalStorageProvider class provides methods to interact with the local file system for file storage.
 * It extends the StorageProvider class and implements the methods for uploading, deleting, and downloading files.
 *
 * By default, this provider uses the `process.cwd()/uploads` directory as root directory for all uploads unless
 * it is overwritten by setting the `root` option.
 */
export class LocalStorageProvider extends StorageProvider<ILocalStorageProviderOptions> {
  constructor(
    public override readonly id: string,
    protected override options: ILocalStorageProviderOptions,
    protected override moduleRef: ModuleRef,
  ) {
    super(id, options, moduleRef);
    const multerConfig = moduleRef.get(ConfigService, { strict: false }).get('file.upload');
    this.options.root ??= multerConfig?.dest || LocalStorageProvider.getDefaultUploadRoot();
  }

  /**
   * Returns the upload root directory.
   *
   * @return {string} The upload root directory.
   */
  getUploadRoot(): string {
    return this.options.root!;
  }

  /**
   * Writes the given upload file to the bucket path which consists of `${options.path}/${bucket}/${guid}`.
   *
   * @param upload
   */
  async upload(upload: FileUpload): Promise<void> {
    const filePath = await this.createAndVerifyFilePath(upload.bucket, upload.guid);
    //return writeFile(filePath, upload.file.buffer);
  }

  /**
   * Assures the given file is deleted from storage.
   *
   * @param {BaseFile} file - The file to delete.
   * @returns {Promise<void>} - Promise that resolves once the file is deleted.
   */
  async delete(file: FileAccess): Promise<void> {
    const filePath = await this.createAndVerifyFilePath(file.bucket, file.guid);
    try {
      await unlink(filePath);
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      if (error.code !== 'ENOENT') throw err;
    }
  }

  /**
   * Loads the file from storage.
   *
   * @param file
   */
  async download(file: FileAccess): Promise<Readable | null> {
    const filePath = await this.createAndVerifyFilePath(file.bucket, file.guid);
    try {
      // testing permissions for the file before creating a stream
      await access(filePath, fs.constants.F_OK);
      return fs.createReadStream(filePath);
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === 'ENOENT') return null;
      else throw err;
    }
  }

  /**
   * Creates and verifies the file path by checking if the provided bucket and guid are valid. If they are not valid,
   * an IntegrityException is thrown.
   *
   * @param {string} bucket - The storage bucket name.
   * @param {string} guid - The file guid.
   * @protected
   * @returns {string} - The created and verified file path.
   * @throws {IntegrityException} - If the provided bucket or guid are invalid.
   */
  protected async createAndVerifyFilePath(bucket: string, guid: string): Promise<string> {
    if (!isGuid(guid)) throw new IntegrityException(`Invalid file guid provided: '${guid}'`);
    if (!REGEX_STORAGE_BUCKET.test(bucket)) {
      throw new IntegrityException(`Invalid storage bucket provided: '${bucket}'`);
    }

    const bucketDir = join(
      this.options.root || LocalStorageProvider.getDefaultUploadRoot(),
      bucket,
    );

    await mkdir(bucketDir, { recursive: true });

    return join(bucketDir, guid);
  }

  public static getDefaultUploadRoot() {
    return join(process.cwd(), 'uploads');
  }
}
