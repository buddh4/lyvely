import { ISortable } from '@/common';
import { RoleVisibilityLevel } from '@/profiles';

export interface IContentDataType {
  title?: string;
  text?: string;
}

export enum CreatedAsType {
  User = 'user',
  Profile = 'profile',
  Organization = 'organization',
}

export interface IContentAuthor<TID = any> {
  type: CreatedAsType;
  authorId: TID;
}

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
  visibility: RoleVisibilityLevel;
  childCount?: number;
  archived?: boolean;
  deleted?: boolean;
  locked?: boolean;
}

export interface IContentTypeMeta {
  archivable?: boolean;
  editable?: boolean;
  reactable?: boolean;
  commentable?: boolean;
}

export const getDefaultTypeMeta = (): IContentTypeMeta => ({
  archivable: true,
  editable: true,
  reactable: true,
  commentable: true,
});

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
export interface IContent<TID = any, TConfig extends Object = any> extends ISortable {
  id: string;
  oid: TID;
  pid: TID;
  type: string;
  content: IContentDataType;
  meta: IContentMetadata<TID>;
  config: TConfig;
  tagIds: TID[];
  logs: Array<IContentLog<any, TID>>;
  getTitle: () => string;
  getText: () => string;
  getTypeMeta: () => IContentTypeMeta;
}
