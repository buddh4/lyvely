import { IBaseQueryOptions } from '@/core';

/**
 * Interface representing options for content updates.
 * @interface IContentUpdateOptions
 * @extends IBaseQueryOptions
 */
export interface IContentUpdateOptions extends IBaseQueryOptions {
  streamSort?: boolean;
  updatedByUser?: boolean;
  liveUpdate?: boolean;
  tagNames?: string[];
}
