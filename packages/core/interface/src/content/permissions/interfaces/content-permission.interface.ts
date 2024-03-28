import {
  IPermission,
  IPermissionSubject,
  BasePermissionType,
  IPermissionSetting,
} from '@/permissions';
import { IProfilePermissionObject, ProfileRelationRole, ProfileType } from '@/profiles';

/**
 * Represents the possible roles of a user (or visitor) in relation to a content.
 * @enum {string}
 */
export enum ContentUserRole {
  /** Owner of the profile. **/
  Owner = ProfileRelationRole.Owner,
  /** Admin of the profile. **/
  Admin = ProfileRelationRole.Admin,
  /** Manager of the content. **/
  Manager = 'manager',
  /** Author of the content. **/
  Author = 'author',
  /** Assigned user. **/
  Assignee = 'assignee',
  /** Moderator of the profile. **/
  Moderator = ProfileRelationRole.Moderator,
  /** Simple member of the profile. **/
  Member = ProfileRelationRole.Member,
  /** Guest member of the profile. **/
  Guest = ProfileRelationRole.Guest,
  /** Organization member of the profiles' organization. **/
  Organization = ProfileRelationRole.Organization,
  /** Follower of the profile. **/
  Follower = ProfileRelationRole.Follower,
  /** An authenticated user. **/
  User = ProfileRelationRole.User,
  /** An unauthenticated visitor. **/
  Visitor = ProfileRelationRole.Visitor,
}

/**
 * Defines a flat hierarchy of content user roles. This is used for permissions and access rules in which a
 * role with a lower level e.g. an admin includes permissions and access rights of higher levels e.g. members.
 */
export const contentRoleHierarchy = [
  ContentUserRole.Owner,
  ContentUserRole.Admin,
  ContentUserRole.Manager,
  ContentUserRole.Author,
  ContentUserRole.Assignee,
  ContentUserRole.Moderator,
  ContentUserRole.Member,
  ContentUserRole.Guest,
  ContentUserRole.Organization,
  ContentUserRole.Follower,
  ContentUserRole.User,
  ContentUserRole.Visitor,
];

/**
 * Interface used to define profile level permissions.
 */
export interface IContentPermission
  extends IPermission<ContentUserRole, BasePermissionType.Content> {
  profileTypes?: ProfileType[];
}

/**
 * This interface defines the data of a profile permission subject which represents a user in a profile permission context.
 */
export interface IContentPermissionSubject extends IPermissionSubject<ContentUserRole> {}

/**
 * This interface defines the data of a profile permission object which represents the profile itself in a profile
 * permission context.
 */
export interface IContentPermissionObject extends IProfilePermissionObject {}

/**
 * Represents a permission setting in profile context.
 */
export interface IContentPermissionSetting<TID = string>
  extends IPermissionSetting<TID, ContentUserRole> {}
