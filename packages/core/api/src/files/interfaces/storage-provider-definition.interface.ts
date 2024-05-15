import type { IStorageProvider } from './storage-provider.interface';
import type { Type } from '@lyvely/common';

/**
 * Represents the configuration definition of a storage provider.
 */
export interface IStorageProviderDefinition<TOptions = any> {
  /** Unique id **/
  id: string;

  /** **/
  class: Type<IStorageProvider>;
  options?: TOptions;
}
