import type {
  FileAccess,
  IFileDownloadOptions,
  IStorageProvider,
  IStorageProviderDefinition,
  IStorageService,
} from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { IStorageConfig, LyvelyFileOptions, ServerConfiguration } from '@/config';
import { ILocalStorageProviderOptions, LocalStorageProvider } from '../providers';
import { IntegrityException, MisconfigurationException } from '@lyvely/interface';
import { FileUpload } from '../models';
import { createBaseModelAndInit, isGuid, type Type } from '@lyvely/common';
import { REGEX_STORAGE_BUCKET } from '../files.constants';
import { FileMimeTypeRegistry } from '../registries';
import { File, FileMetadata, FileVariant, GenericFile } from '../schemas';
import type { StrictBaseDocumentData } from '@/core';
import type { Readable } from 'node:stream';
import { join } from 'path';

const LOCAL_STORAGE_PROVIDER_ID = 'local';

const LOCAL_STORAGE_PROVIDER_DEFINITION = {
  id: LOCAL_STORAGE_PROVIDER_ID,
  class: LocalStorageProvider,
} as IStorageProviderDefinition<ILocalStorageProviderOptions>;

const DEFAULT_STORAGE_CONFIG: IStorageConfig = {
  default: LOCAL_STORAGE_PROVIDER_ID,
  providers: [LOCAL_STORAGE_PROVIDER_DEFINITION],
};

/**
 * Represents the main storage service responsible for managing and forwarding upload and download requests
 * to storage providers.
 */
@Injectable()
export class StorageService implements IStorageService {
  /** The class logger. **/
  private logger = new Logger(StorageService.name);

  /** A default storage provider, used for all buckets without specific configuration. **/
  private defaultStorage: IStorageProvider;

  /** Stores all storage providers by id key. **/
  private storages: Map<string, IStorageProvider> = new Map();

  /** Stores providers assigned to specific buckets. **/
  private buckets: Map<string, IStorageProvider> = new Map();

  constructor(
    private readonly fileMimeTypeRegistry: FileMimeTypeRegistry,
    private readonly configService: ConfigService<ServerConfiguration>,
    private moduleRef: ModuleRef,
  ) {
    const filesConfig = this.configService.get<LyvelyFileOptions>('files', {});
    const storageConfig = filesConfig.storage || DEFAULT_STORAGE_CONFIG;

    this.validateStorageConfig(storageConfig);
    this.initStorageProviders(storageConfig);

    if (!this.getStorage(LOCAL_STORAGE_PROVIDER_ID)) {
      this.initStorageProvider(LOCAL_STORAGE_PROVIDER_DEFINITION);
    }

    if (!storageConfig.default) {
      this.defaultStorage = storageConfig?.providers?.[0]?.id
        ? this.storages.get(storageConfig.providers[0].id)!
        : this.getLocalStorageProvider();
    } else {
      this.defaultStorage =
        this.storages.get(storageConfig.default) || this.getLocalStorageProvider();
    }

    if (!this.defaultStorage) {
      throw new MisconfigurationException('No storage provider configured.');
    }

    this.logger.log(`Use default storage provider ${this.defaultStorage.id}`);

    this.setBucketProvider(storageConfig);
  }

  /**
   * Retrieves the storage provider associated with the given ID.
   *
   * @param {string} id - The unique identifier of the storage provider.
   * @return {IStorageProvider | null} - The storage provider object associated with the given ID, or null if not found.
   */
  getStorage<T extends IStorageProvider = IStorageProvider>(id: string): T | null {
    return (this.storages.get(id) as T) || null;
  }

  /**
   * Retrieves the local storage provider.
   *
   * @return {IStorageProvider} The local storage provider.
   */
  private getLocalStorageProvider(): LocalStorageProvider {
    const localProvider = this.getStorage<LocalStorageProvider>(LOCAL_STORAGE_PROVIDER_ID);
    if (!localProvider) throw new IntegrityException('No local storage provider found.');
    return localProvider;
  }

  /**
   * Validates the storage configuration.
   *
   * @param {object} config - The storage configuration object.
   * @throws {MisconfigurationException} Throws a `MisconfigurationException` if the storage configuration is invalid.
   * @private
   */
  private validateStorageConfig(config: IStorageConfig) {
    // If we have more than 1 provider but no default provider config, we error out.
    if (!config.default && (config.providers?.length || 0) > 1) {
      throw new MisconfigurationException('Missing default storage provider configuration.');
    }

    // Default provider must exist in providers configuration.
    if (config.default && !config.providers?.find((def) => def.id === config.default)) {
      throw new MisconfigurationException(
        `Invalid default storage provider configured: ${config.default}.`,
      );
    }
  }

  /**
   * Initializes all storage providers of the provided configuration.
   *
   * @param {IStorageConfig} config - The configuration object containing information about the storage providers.
   * @private
   */
  private initStorageProviders(config: IStorageConfig) {
    config.providers?.forEach((definition) => {
      this.initStorageProvider(definition);
    });
  }

  /**
   * Initializes a single storage provider based on the provided definition.
   *
   * @param {IStorageProviderDefinition} definition - The storage provider definition to initialize.
   * @private
   */
  private initStorageProvider(definition: IStorageProviderDefinition) {
    this.logger.log(`Initialize storage provider ${definition.id}`);
    const ProviderClass = definition.class;
    this.storages.set(
      definition.id,
      new ProviderClass(definition.id, { ...definition.options }, this.moduleRef),
    );
  }

  /**
   * Initializes all storage providers.
   *
   * @return {Promise<void>} A promise that resolves once the module has been initialized.
   */
  async onModuleInit(): Promise<void> {
    try {
      await Promise.all(
        Array.from(this.storages.values()).map((provider) => provider.initialize()),
      );
    } catch (e) {
      console.error('There was an error initializing a storage prvider.');
      throw e;
    }
  }

  /**
   * Sets dedicated provider for specific buckets by configuration.
   *
   * @param {IStorageConfig} config - The storage configuration.
   * @private
   */
  private setBucketProvider(config: IStorageConfig) {
    if (!config.buckets?.length) return;
    config.buckets.forEach(({ name, storage }) => {
      const provider = this.storages.get(storage);
      if (!provider)
        throw new MisconfigurationException(`Invalid provider configured for bucket ${name}`);
      this.buckets.set(name, provider);
    });
  }

  /**
   * Retrieves the storage provider associated with a specific bucket.
   *
   * @param {string} bucket - The name of the bucket.
   * @private
   * @return {IStorageProvider} - The storage provider associated with the bucket.
   */
  private getProviderByBucket(bucket: string): IStorageProvider {
    return this.buckets.get(bucket) || this.defaultStorage;
  }

  /**
   * Retrieves the file upload path based on the provided GUID.
   *
   * @param {string} guid - The GUID of the file.
   * @return {string} The file upload path.
   * @throws {IntegrityException} If the provided GUID is invalid.
   */
  getFileUploadPath(guid: string) {
    if (isGuid(guid)) throw new IntegrityException(`Invalid file guid: '${guid}'`);
    return join(this.getLocalStorageProvider().getUploadRoot(), guid);
  }

  /**
   * Uploads a file to the specified bucket and persists a file instance unless `options.persist` is set to false.
   *
   * @param {FileUpload} upload - The file upload object containing the file to be uploaded.
   * @returns {Promise<File>} - A Promise that resolves with the uploaded file object.
   */
  async upload(upload: FileUpload): Promise<File> {
    const { bucket, guid, createdBy, context } = upload;
    this.validateFilePathOrThrow(bucket, guid);
    const storage = this.getProviderByBucket(upload.bucket);
    await storage.upload(upload);
    const FileType: Type<File> = this.fileMimeTypeRegistry.getTypeConstructor(
      upload.file.mimetype,
      GenericFile,
    );

    return createBaseModelAndInit(FileType, {
      guid,
      createdBy,
      oid: context?.oid,
      pid: context?.pid,
      bucket: bucket,
      meta: await this.createMetaData(upload),
    } as StrictBaseDocumentData<Omit<File, 'type'>>);
  }

  /**
   * Creates typed file metadata instance for a given file upload.
   *
   * @param {FileUpload} upload - The uploaded file object.
   * @private
   * @return {Promise<FileMetadata>} - The promise that resolves to the created metadata.
   */
  private async createMetaData(upload: FileUpload): Promise<FileMetadata> {
    return this.fileMimeTypeRegistry
      .getTypeMeta(upload.file.mimetype, {
        async metaFactory({ file }: FileUpload): Promise<FileMetadata> {
          const { originalname: name, mimetype: mimeType, size } = file;
          return new FileMetadata({ name, mimeType, size });
        },
      })
      .metaFactory(upload);
  }

  /**
   * Downloads a file or variant of a file from a specified bucket.
   *
   * @param {File} file - The file object to be downloaded.
   * @param {IFileDownloadOptions} [options] - Additional download options.
   * @returns {Promise<Readable | null>} - A promise that resolves to a Readable stream if the download is successful,
   * or null if the file or variant is not found.
   */
  async download(file: FileAccess, options?: IFileDownloadOptions): Promise<Readable | null> {
    if (options?.variant) {
      const variant = file.variants?.find((f) => f.variant === options.variant);
      if (!variant) return null;
      return this.getProviderByBucket(variant.bucket).download(variant);
    }
    return this.getProviderByBucket(file.bucket).download(file);
  }

  /**
   * Download a file from a specified bucket.
   *
   * @param {File} file - The file object to be downloaded.
   * @param {IFileDownloadOptions} [options] - Additional download options.
   * @returns {Promise<Readable | null>} - A promise that resolves to a Readable stream if the download is successful,
   * or null if the file or variant is not found.
   */
  async delete(file: FileAccess, options?: IFileDownloadOptions): Promise<void> {
    if (options?.variant) {
      const variant = file.variants?.find((f) => f.variant === options.variant);
      if (!variant) return;
      return this.getProviderByBucket(variant.bucket).delete(variant);
    }
    return this.getProviderByBucket(file.bucket).delete(file);
  }

  /**
   * Finds a specific variant of a file.
   *
   * @param {File} file - The file to search for the variant.
   * @param {string} variant - The variant to find.
   * @returns {FileVariant | null} - The found variant or null if not found.
   * @private
   */
  private findVariant(file: File, variant: string): FileVariant | null {
    return file.variants?.find((f) => f.variant === variant) || null;
  }

  /**
   * Validates the given bucket and guid component of our file path and throws an Error if not valid.
   *
   * @param {string} bucket - The storage bucket.
   * @param {string} guid - The file guid.
   *
   * @private
   *
   * @throws {IntegrityException} - If the file guid or storage bucket is invalid.
   */
  private validateFilePathOrThrow(bucket: string, guid: string) {
    if (!isGuid(guid)) throw new IntegrityException(`Invalid file guid: '${guid}'`);
    if (!REGEX_STORAGE_BUCKET.test(bucket))
      throw new IntegrityException(`Invalid storage bucket: '${bucket}'`);
  }
}
