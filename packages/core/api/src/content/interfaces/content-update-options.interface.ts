import { UpdateOptions } from '@/core';

/**
 * Interface representing options for content updates.
 * @interface IContentUpdateOptions
 * @extends IBaseQueryOptions
 */
export interface IContentUpdateOptions extends UpdateOptions {
  streamSort?: boolean;
  updatedByUser?: boolean;
  liveUpdate?: boolean;
  tagNames?: string[];
}
