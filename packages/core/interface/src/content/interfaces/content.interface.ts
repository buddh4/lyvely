import { ISortable } from '@/common';
import { ProfileRoleLevel } from '@/profiles';

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
  visibility: ProfileRoleLevel;
  childCount?: number;
  archived?: boolean;
  deleted?: boolean;
  locked?: boolean;
}

export interface IContentTypeMeta {
  deletable: boolean;
  editable: boolean;
  reactable: boolean;
  commentable: boolean;
  taggable: boolean;
}

export interface IContentPolicies {
  canWrite: boolean;
  canDelete: boolean;
  canManage: boolean;
  canRead: boolean;
}

export const getDefaultTypeMeta = (): IContentTypeMeta => ({
  deletable: true,
  editable: true,
  reactable: true,
  commentable: true,
  taggable: true,
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
