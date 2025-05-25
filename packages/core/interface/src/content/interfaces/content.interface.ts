import { ISortable } from '@/common';
import { ProfileRoleLevel } from '@/profiles';

/**
 * Interface representing the basic structure of a content data type.
 */
export interface IContentDataType {
  title?: string;
  text?: string;
}

/**
 * Represents the type of author which should be displayed.
 *
 * This enumeration allows the values 'user', 'profile', and 'organization'
 * to be used to specify the type of entity that was created.
 *
 * @enum {string}
 */
export enum CreatedAsType {
  User = 'user',
  Profile = 'profile',
  Organization = 'organization',
}

/**
 * Represents a content author.
 *
 * @template TID - The type of the author ID.
 */
export interface IContentAuthor<TID = any> {
  type: CreatedAsType;
  authorId: TID;
}

/**
 * Represents the metadata for content entries.
 * @template TID - The type of ID used for identifying content.
 */
export interface IContentMetadata<TID = any> {
  mid?: TID;
  createdBy: TID;
  managers?: TID[];
  assignees?: TID[];
  createdAs?: IContentAuthor<TID>;
  createdAt: Date;
  updatedAt: Date;
  streamSort: number;
  sortOrder?: number;
  visibility: ProfileRoleLevel;
  childCount?: number;
  archived?: boolean;
  deleted?: boolean;
  locked?: boolean;
  attachedFileIds?: TID[];
}

/**
 * Represents static metadata for a content type.
 *
 * The `IContentTypeMeta` interface defines properties for defining the behavior and characteristics of a content type.
 * These properties are used to determine whether a content type is deletable, editable, reactable, commentable, and taggable.
 * Additionally, it includes a property to indicate whether the content type is meant to be maintained collaboratively by multiple users.
 * Each property has a default value of `true`, unless overridden.
 */
export interface IContentTypeMeta {
  /** Whether this content type is deletable. (default: true) **/
  deletable?: boolean;
  /** Whether this content type is editable. (default: true) **/
  editable?: boolean;
  /** Whether this content type is reactable. (default: true) **/
  reactable?: boolean;
  /** Whether this content type is commentable. (default: true) **/
  commentable?: boolean;
  /** Whether this content type is taggable. (default: true) **/
  taggable?: boolean;
  /**
   * Defines if this type of content is meant to be maintained collaboratively by multiple users or rather personal.
   * (default: true)
   * **/
  isCollaborative?: boolean;
}

/**
 * Represents the content policies for a specific content entity.
 * @interface
 *
 * @property {boolean} canWrite - Indicates whether the entity can be written by the current user context.
 * @property {boolean} canDelete - Indicates whether the entity can be deleted by the current user context.
 * @property {boolean} canManage - Indicates whether the entity can be managed by the current user context.
 * @property {boolean} canRead - Indicates whether the entity can be read by the current user context.
 * @property {boolean} [populated] - Indicates whether the entity has been populated by the current user context.
 */
export interface IContentPolicies {
  canWrite: boolean;
  canDelete: boolean;
  canManage: boolean;
  canRead: boolean;
  populated?: boolean;
}

/**
 * Returns the default static type metadata for a content type.
 *
 * @returns {IContentTypeMeta} The default type metadata.
 */
export const getDefaultTypeMeta = (): IContentTypeMeta => ({
  deletable: true,
  editable: true,
  reactable: true,
  commentable: true,
  taggable: true,
});

/**
 * The `IContentLog` interface represents a basic log entry for a content entry.
 * It contains information about the content item, the user who updated it,
 * and the timestamp of the update.
 *
 * @template TData - The type of the content item data. Default is `any`.
 * @template TID - The type of the user ID. Default is `any`.
 *
 * @property {TID} [updatedBy] - The ID of the user who updated the content item.
 * @property {Date} updatedAt - The timestamp of when the content item was updated.
 * @property {TData} [data] - The data of the content item.
 * @property {string} type - The type of the content item.
 */
export interface IContentLog<TData = any, TID = any> {
  updatedBy?: TID;
  updatedAt: Date;
  data?: TData;
  type: string;
}

/**
 * Represents the base structure of content in an application.
 *
 * @interface IContent
 * @template TID - The type of the content identifier.
 * @template TConfig - The type of the content configuration object.
 * @extends ISortable
 */
export interface IContent<
  TID = any,
  TConfig extends Object | undefined = any,
  TState extends Object | undefined = any,
  TData extends IContentDataType = IContentDataType,
> extends ISortable {
  id: string;
  oid: TID;
  pid: TID;
  type: string;
  content: TData;
  meta: IContentMetadata<TID>;
  config: TConfig;
  state: TState;
  tagIds: TID[];
  policies: IContentPolicies;
  logs: Array<IContentLog<any, TID>>;
  getTitle: () => string;
  getText: () => string;
  getTypeMeta: () => IContentTypeMeta;
}
