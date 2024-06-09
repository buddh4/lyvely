import {
  BasePermissionType,
  IPermission,
  IPermissionObject,
  IPermissionSubject,
} from './permissions.interface';
import { UserRole } from './user-role.interface';

/**
 * A global permission is not related to any profile.
 */
export interface IGlobalPermission extends IPermission<UserRole, BasePermissionType.Global> {}

/**
 * This interface defines the data of a global permission subject which represents a user in a global permission context.
 */
export interface IGlobalPermissionSubject extends IPermissionSubject<UserRole> {}

/**
 * This interface defines the data of a global permission object which represents the platform itself in a global permission context.
 */
export interface IGlobalPermissionObject extends IPermissionObject<UserRole> {}
