import { ProfileRelationRole } from './profile-relation-role.enum';
import {
  IPermission,
  IPermissionSubject,
  IPermissionSetting,
  BasePermissionType,
  IPermissionObject,
} from '@/permissions';
import { UserStatus } from '@/users';

/**
 * Interface used to define profile level permissions.
 */
export interface IProfilePermission
  extends IPermission<ProfileRelationRole, BasePermissionType.Profile> {}

/**
 * This interface defines the data of a profile permission subject which represents a user in a profile permission context.
 */
export interface IProfilePermissionSubject extends IPermissionSubject<ProfileRelationRole> {
  relationStatus?: UserStatus;
}

/**
 * This interface defines the data of a profile permission object which represents the profile itself in a profile
 * permission context.
 */
export interface IProfilePermissionObject extends IPermissionObject<ProfileRelationRole> {}
