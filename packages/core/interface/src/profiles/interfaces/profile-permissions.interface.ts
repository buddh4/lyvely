import { ProfileRelationRole } from './profile-relation-role.enum';
import { IPermission, IPermissionSubject, IPermissionSetting } from '@/permissions';
import { UserStatus } from '@/users';

/**
 * Interface used to define profile level permissions.
 */
export interface IProfilePermission extends IPermission<ProfileRelationRole> {}

/**
 * This interface defines permission subject information required to verify profile level permission.
 */
export interface IProfilePermissionSubject extends IPermissionSubject<ProfileRelationRole> {
  settings?: IPermissionSetting[];
  relationStatus?: UserStatus;
}
