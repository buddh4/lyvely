import { UserStatus } from '@/users/interfaces/user-status.enum';
import { VisitorStrategy } from '@/users/interfaces/visitor-strategy.interface';

/**
 * Used to define a global or profile permission in a network.
 *
 * A permission is
 */
export interface IPermission<TRole, TType extends string> {
  /** Unique permission id **/
  id: string;

  /** Translatable permission name used in permission settings. **/
  name: string;

  /** Translatable permission description used in permission settings. **/
  description: string;

  /** Module id this permission is related to **/
  moduleId: string;

  /** Minimum role level this permission needs to be assigned to e.g. admin would mean admin and owner are always permitted **/
  min: TRole;

  /** Maximum role level this permission can be assigned to e.g. member means no guest or non-member role is permitted **/
  max: TRole;

  /** The default role this permission is assigned to, needs to respect the min/max range **/
  default: TRole;

  /** If this permission depends on other permissions **/
  dependencies?: string[];

  /** Can be used to allow other user statuses beside UserStatus.Active which is the default **/
  userStatuses?: UserStatus[];

  /** Defines a type of permission, e.g. profile, user, global **/
  type: TType;
}

/**
 * This interface defines the data of a permission subject which access against a permission object is verified e.g. a user.
 * @template TRole Representing the type of roles allowed.
 */
export interface IPermissionSubject<TRole> {
  /** Defines the role of the subject in relation to the permission object **/
  role: TRole;
  /** Defines the groups the subject is part of **/
  groups?: string[];
  /** Defines the status of the subject in relation to the object. **/
  userStatus?: UserStatus;
  /** Defines the status of the user relation. **/
  relationStatus?: UserStatus;
}

/**
 * Represents a permission object which is accessed by the permission subject.
 * @template TRole Representing the type of roles allowed.
 */
export interface IPermissionObject<TRole> {
  /**
   * Returns an array of permission settings configured for this permission object.
   *
   * @return {IPermissionSetting<TRole>[]} An array of permission settings for the role.
   */
  getPermissionSettings(): IPermissionSetting<string, TRole>[];

  /**
   * Retrieves an array of permission groups.
   *
   * @return {string[]} An array of strings representing the permission groups.
   */
  getPermissionGroups(): string[];
}

/**
 * Defines a permission setting state e.g. in profile settings or configuration.
 * @template TRole Representing the type of roles allowed.
 */
export interface IPermissionSetting<TID = string, TRole = string> {
  id: string;
  role: TRole;
  groups?: TID[];
}

/**
 * Permission config used in app- and server-configuration.
 *
 * @example
 *
 * {
 *   defaults: [{ id: 'some-permission', role: GlobalPermissionRole.Admin }]
 * }
 */
export interface IPermissionConfig {
  /** Can be used to overwrite default permission roles **/
  defaults?: IPermissionSetting<any>[];
  visitorStrategy: VisitorStrategy;
}

/**
 * Enum representing the base permission roles.
 *
 * @enum {string}
 * @readonly
 */
export enum BasePermissionRole {
  User = 'user',
  Visitor = 'visitor',
}

export enum BasePermissionType {
  Global = 'global',
  Profile = 'profile',
  User = 'user',
}
