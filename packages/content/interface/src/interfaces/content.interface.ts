import { ISortable } from '@lyvely/common';

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
  createdAs?: IContentAuthor<TID>;
  createdAt: Date;
  updatedAt: Date;
  streamSort: number;
  sortOrder?: number;
  visibility: ContentVisibilityLevel;
  childCount?: number;
  archived?: boolean;
  locked?: boolean;
}

export interface IContentLog<TData = any, TID = any> {
  updatedBy?: TID;
  updatedAt: Date;
  data?: TData;
  type: string;
}

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
  getTitle(): string;
  getText(): string;
}

/**
 * A role is assigned with a specific content visibility level, which defines the level of visible and accessible content
 * of a given role. A role can only view content which a visibility level >= the roles visibility level.
 */
export enum ContentVisibilityLevel {
  Owner,
  Admin,
  Moderator,
  Member,
  Guest, // External explicitly invited guests
  Organization,
  User, // Registered users
  Public, // Unregistered users
}
