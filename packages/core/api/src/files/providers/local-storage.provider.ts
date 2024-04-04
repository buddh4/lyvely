import type { ModuleRef } from '@nestjs/core';
import { StorageProvider } from './storage.provider';
import { join } from 'path';
import type { FileUpload } from '../models';
import { isGuid } from '@lyvely/common';
import { IntegrityException, MisconfigurationException } from '@lyvely/interface';
import { rename, unlink, access, mkdir, writeFile } from 'node:fs/promises';
import { REGEX_STORAGE_BUCKET } from '../files.constants';
import type { Readable } from 'node:stream';
import fs from 'node:fs';
import type { FileAccess } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { isMemoryFile } from '@/files/helpers/file-info.helper';

export interface ILocalStorageProviderOptions {
  dest?: string;
}

/**
 * The LocalStorageProvider class provides methods to interact with the local file system for file storage.
 * It extends the StorageProvider class and implements the methods for uploading, deleting, and downloading files.
 *
 * By default, this provider uses the `process.cwd()/storage` directory as root directory for all uploads unless
 * it is overwritten by setting the `root` option.
 */
export class LocalStorageProvider extends StorageProvider<ILocalStorageProviderOptions> {
  protected logger = new Logger(LocalStorageProvider.name);
  constructor(
    public override readonly id: string,
    protected override options: ILocalStorageProviderOptions,
    protected override moduleRef: ModuleRef,
  ) {
    super(id, options, moduleRef);
    this.options.dest ??= LocalStorageProvider.getLocalStorageRoot(
      moduleRef.get(ConfigService, { strict: false }),
    );

    if (!this.options.dest?.length)
      throw new MisconfigurationException(`Local storage upload path can not be empty.`);
  }

  /**
   * Initializes the storage directory.
   *
   * @return {Promise<void>} - A Promise that resolves once the directory has been successfully created.
   */
  async initialize(): Promise<void> {
    this.logger.log(`Setup local storage directory (${this.id}): ${this.options.dest}`);
    await mkdir(this.options.dest!, { recursive: true }).catch((e) => {
      this.logger.error(
        `Could not initialize local storage directory (${this.id}): ${this.options.dest}`,
        (<Error>e).stack,
      );
    });
  }

  static getLocalStorageRoot(configService: ConfigService) {
    return configService.get('file.storage.local.dest') || LocalStorageProvider.getDefaultRoot();
  }

  /**
   * Returns the upload root directory.
   *
   * @return {string} The upload root directory.
   */
  getUploadRoot(): string {
    return this.options.dest!;
  }

  /**
   * Writes the given upload file to the bucket path which consists of `${options.path}/${bucket}/${guid}`.
   *
   * @param upload
   */
  async upload(upload: FileUpload): Promise<void> {
    const { file } = upload;
    const filePath = await this.createAndVerifyFilePath(upload.bucket, upload.guid);
    if (isMemoryFile(file)) {
      return writeFile(filePath, file.buffer);
    } else {
      return rename(file.path, filePath);
    }
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

    const bucketDir = join(this.options.dest || LocalStorageProvider.getDefaultRoot(), bucket);

    await mkdir(bucketDir, { recursive: true });

    return join(bucketDir, guid);
  }

  /**
   * Returns the default local storage root path.
   *
   * @returns {string} The default upload root path.
   */
  public static getDefaultRoot() {
    return join(process.cwd(), 'storage');
  }
}
