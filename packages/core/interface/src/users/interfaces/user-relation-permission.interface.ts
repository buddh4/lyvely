import {
  IPermission,
  IPermissionSubject,
  BasePermissionType,
  IPermissionObject,
  IPermissionSetting,
} from '@/permissions/interfaces';
import { UserRelationRole } from './user-relation.roles';

/**
 * Interface used to define user relation level permissions.
 */
export interface IUserRelationPermission
  extends IPermission<UserRelationRole, BasePermissionType.Profile> {}

/**
 * This interface defines the data of a user relation permission subject which represents the user accessing another
 * user in a user relation permission context.
 */
export interface IUserRelationPermissionSubject extends IPermissionSubject<UserRelationRole> {}

/**
 * Represents a permission setting in user context.
 */
export interface IUserRelationPermissionSetting<TID = string>
  extends IPermissionSetting<TID, UserRelationRole> {}

/**
 * This interface defines the data of a user relation permission object which represents the user which is accessed
 * by another user in a user relation permission context.
 */
export interface IUserRelationPermissionObject extends IPermissionObject<UserRelationRole> {}
