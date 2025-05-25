import type { ILocalStorageProviderOptions } from './local-storage-provider-options.interface';
import type { IStorageProviderDefinition } from './storage-provider-definition.interface';
import type { ModuleConfig } from '@/core';

export interface IStorageBucketDefinition {
  name: string;
  storage: string;
}

export interface IStorageConfig {
  default?: string;
  providers?: IStorageProviderDefinition[];
  buckets?: IStorageBucketDefinition[];
  local?: ILocalStorageProviderOptions;
}

export interface IFilesOptions {
  storage?: IStorageConfig;
  upload?: {
    /** Used for file uploads, this should be a temporary folder (Default: storage.local.dest/tmp) **/
    dest?: string;
    /** For multipart forms, the max file size (in bytes)(Default: Infinity) */
    maxSizeInBytes?: number;
    /** For this the ConfigurableFileValidationPipe needs to be used. **/
    allowedMimeTypes?: string[];
  };
}

export type FilesModuleConfig = ModuleConfig<'files', IFilesOptions>;
