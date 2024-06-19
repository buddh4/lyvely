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
    limits?: {
      /** For multipart forms, the max file size (in bytes)(Default: Infinity) */
      fileSize?: number;
    };
  };
}

export type FilesModuleConfig = ModuleConfig<'files', IFilesOptions>;
