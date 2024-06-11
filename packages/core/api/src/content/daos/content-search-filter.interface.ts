import { type DocumentIdentity, FilterQuery } from '@/core';
import { Content } from '@/content/schemas';
import { ProfileRoleLevel } from '@lyvely/interface';

/**
 * Interface representing a content search filter.
 */
export interface IContentSearchFilter {
  /** Search for a specific document. **/
  cid?: DocumentIdentity<Content>;

  /**
   * If set to true, the query will only return archived documents.
   * If set to false, the query will only return unarchived documents.
   * Otherwise, the query will ignore the archived state of the documents.
   */
  archived?: boolean;

  /** Set the maximum profile relation role level. **/
  roleLevel?: ProfileRoleLevel;

  /** Can be used to add additional query filter conditions. **/
  conditions?: FilterQuery<Content>[];
}
