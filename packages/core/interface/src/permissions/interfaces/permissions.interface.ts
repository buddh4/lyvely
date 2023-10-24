import { UserStatus } from '@/users';

/**
 * Used to define a global or profile permission in a network.
 *
 * A permission is
 */
export interface IPermission<IRole> {
  /** Unique permission id **/
  id: string;

  /** Module id this permission is related to **/
  moduleId: string;

  /** Minimum role level this permission needs to be assigned to e.g. admin would mean admin and owner are always permitted **/
  min: IRole;

  /** Maximum role level this permission can be assigned to e.g. member means no guest or non-member role is permitted **/
  max: IRole;

  /** The default role this permission is assigned to, needs to respect the min/max range **/
  default: IRole;

  /** If this permission depends on other permissions **/
  dependencies?: string[];

  /** Can be used to allow other user statuses beside UserStatus.Active which is the default **/
  userStatuses?: UserStatus[];

  /** If false or undefined means the permission is a profile level permission **/
  global?: boolean;
}

/**
 * A global permission is not related to any profile.
 */
export interface IGlobalPermission extends IPermission<GlobalPermissionRole> {
  global: true;
}

/**
 * This interface defines permission subject information required to verify a global user permission.
 */
export interface IPermissionSubject<IRole> {
  role: IRole;
  userStatus?: UserStatus;
}

/**
 * This interface defines permission subject information required to verify a global permissions.
 */
export interface IGlobalPermissionSubject extends IPermissionSubject<GlobalPermissionRole> {}

/**
 * Defines global roles of a user or visitor.
 */
export enum GlobalPermissionRole {
  Admin = 'admin',
  Support = 'support',
  User = 'user',
  Visitor = 'visitor',
}

/**
 * Defines a flat hierarchy of global user roles. This is used for permissions and access rules in which a
 * role with a lower level e.g. an admin includes permissions and access rights of higher levels e.g. user.
 */
export const globalPermissionRoleHierarchy = [
  GlobalPermissionRole.Admin,
  GlobalPermissionRole.Support,
  GlobalPermissionRole.User,
  GlobalPermissionRole.Visitor,
];
