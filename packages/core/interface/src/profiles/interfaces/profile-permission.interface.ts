import {
  IPermission,
  IPermissionSubject,
  BasePermissionType,
  IPermissionObject,
  IPermissionSetting,
} from '@/permissions';
import { ProfileRelationRole } from './profile-relation-role.interface';
import type { ProfileType, ProfileVisibilityLevel } from './profile.interface';

/**
 * Interface used to define profile level permissions.
 */
export interface IProfilePermission
  extends IPermission<ProfileRelationRole, BasePermissionType.Profile> {
  profileTypes?: ProfileType[];
}

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
