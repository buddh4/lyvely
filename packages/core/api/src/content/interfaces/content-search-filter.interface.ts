import type { DocumentIdentity } from '@/core';
import { Content } from '@/content';

/**
 * Interface representing a content search filter.
 */
export interface IContentSearchFilter {
  cid?: DocumentIdentity<Content>;
  archived?: boolean;
  roleLevel?: number;
}
