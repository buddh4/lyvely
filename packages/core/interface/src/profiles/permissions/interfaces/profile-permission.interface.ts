import {
  IPermission,
  IPermissionSubject,
  BasePermissionType,
  IPermissionObject,
  IPermissionSetting,
} from '@/permissions';
import { ProfileRelationRole } from '@/profiles/relations';
import { ProfileType, ProfileVisibilityLevel } from '@/profiles/core/interfaces';

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

export type IProfilePermissionData = {
  type: ProfileType;
  hasOrg: boolean;
  visibility: ProfileVisibilityLevel;
};

/**
 * This interface defines the data of a profile permission object which represents the profile itself in a profile
 * permission context.
 */
export interface IProfilePermissionObject<TRole = any> extends IPermissionObject<TRole> {
  getProfilePermissionData(): IProfilePermissionData;
}

/**
 * Represents a permission setting in profile context.
 */
export interface IProfilePermissionSetting<TID = string, TRole = any>
  extends IPermissionSetting<TID, TRole> {}
