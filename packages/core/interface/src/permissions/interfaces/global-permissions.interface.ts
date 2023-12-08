import {
  BasePermissionType,
  IPermission,
  IPermissionObject,
  IPermissionSubject,
} from './permissions.interface';

/**
 * A global permission is not related to any profile.
 */
export interface IGlobalPermission
  extends IPermission<GlobalPermissionRole, BasePermissionType.Global> {}

/**
 * This interface defines the data of a global permission subject which represents a user in a global permission context.
 */
export interface IGlobalPermissionSubject extends IPermissionSubject<GlobalPermissionRole> {}

/**
 * This interface defines the data of a global permission object which represents the platform itself in a global permission context.
 */
export interface IGlobalPermissionObject extends IPermissionObject<GlobalPermissionRole> {}

/**
 * Defines global roles of a user or visitor.
 */
export enum GlobalPermissionRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user',
  Visitor = 'visitor',
}

/**
 * Defines a flat hierarchy of global user roles. This is used for permissions and access rules in which a
 * role with a lower level e.g. an admin includes permissions and access rights of higher levels e.g. user.
 */
export const globalPermissionRoleHierarchy = [
  GlobalPermissionRole.Admin,
  GlobalPermissionRole.Moderator,
  GlobalPermissionRole.User,
  GlobalPermissionRole.Visitor,
];
