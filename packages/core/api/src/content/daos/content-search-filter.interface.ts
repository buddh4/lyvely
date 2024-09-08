import { type DocumentIdentity, FilterQuery } from '@/core';
import { Content } from '@/content/schemas';
import { ProfileRoleLevel } from '@lyvely/interface';
import { Profile, Tag } from '@/profiles';

/**
 * Interface representing a content search filter.
 */
export interface IContentSearchFilter {
  /** Search content of specific profile. **/
  pid?: DocumentIdentity<Profile>;

  /** Search content of specific organization. **/
  oid?: DocumentIdentity<Profile>;

  /** Search for a specific document. **/
  cid?: DocumentIdentity<Content>;

  /**  Search for multiple documents. **/
  cids?: Array<DocumentIdentity<Content>>;

  /** Filter by parent content. **/
  parentId?: DocumentIdentity<Content>;

  /** Filter by tags. **/
  tagIds?: DocumentIdentity<Tag>[];

  /** Filter by content type. **/
  type?: string;

  /** Filter by text query. **/
  query?: string;

  /**
   * If set to true, the query will only return archived documents.
   * If set to false, the query will only return unarchived documents.
   * Otherwise, the query will ignore the archived state of the documents.
   */
  archived?: boolean;

  /**
   * If set to true, the query will only return deleted documents.
   * If set to false, the query will only return non deleted documents.
   * Otherwise, the query will ignore the deleted state of the documents.
   */
  deleted?: boolean;

  /** Set the maximum profile relation role level. **/
  roleLevel?: ProfileRoleLevel;

  /** Can be used to add additional query filter conditions. **/
  conditions?: FilterQuery<Content>[];
}
