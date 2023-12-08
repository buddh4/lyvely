import {
  IPermission,
  IPermissionSubject,
  BasePermissionType,
  IPermissionObject,
  IPermissionSetting,
} from '@/permissions';

/**
 * Represents the possible roles of a user (or visitor) in relation to a profile.
 * @enum {string}
 */
export enum ProfileRelationRole {
  /** Owner of the profile. **/
  Owner = 'owner',
  /** Admin of the profile. **/
  Admin = 'admin',
  /** Moderator of the profile. **/
  Moderator = 'moderator',
  /** Simple member of the profile. **/
  Member = 'member',
  /** Guest member of the profile. **/
  Guest = 'guest',
  /** Organization member of the profiles' organization. **/
  Organization = 'organization',
  /** Follower of the profile. **/
  Follower = 'follower',
  /** An authenticated user. **/
  User = 'user',
  /** An unauthenticated visitor. **/
  Visitor = 'visitor',
}

/**
 * Defines a flat hierarchy of profile relation roles. This is used for permissions and access rules in which a
 * role with a lower level e.g. an admin includes permissions and access rights of higher levels e.g. members.
 */
export const profileRelationRoleHierarchy = [
  ProfileRelationRole.Owner,
  ProfileRelationRole.Admin,
  ProfileRelationRole.Moderator,
  ProfileRelationRole.Member,
  ProfileRelationRole.Guest,
  ProfileRelationRole.Organization,
  ProfileRelationRole.Follower,
  ProfileRelationRole.User,
  ProfileRelationRole.Visitor,
];

/**
 * Interface used to define profile level permissions.
 */
export interface IProfilePermission
  extends IPermission<ProfileRelationRole, BasePermissionType.Profile> {}

/**
 * This interface defines the data of a profile permission subject which represents a user in a profile permission context.
 */
export interface IProfilePermissionSubject extends IPermissionSubject<ProfileRelationRole> {}

/**
 * This interface defines the data of a profile permission object which represents the profile itself in a profile
 * permission context.
 */
export interface IProfilePermissionObject extends IPermissionObject<ProfileRelationRole> {}

/**
 * Represents a permission setting in profile context.
 */
export interface IProfilePermissionSetting<TID = string>
  extends IPermissionSetting<TID, ProfileRelationRole> {}

/**
 * Returns the profile visibility level for a given role.
 * @param role
 */
export function getProfileRoleLevel(role: ProfileRelationRole) {
  return profileRelationRoleHierarchy.indexOf(role);
}
