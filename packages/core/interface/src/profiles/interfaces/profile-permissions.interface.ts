import { ProfileRelationRole } from './profile-relation-role.enum';
import { IPermission, IPermissionContext, IPermissionSetting } from '@/permissions';
import { UserStatus } from '@/users';

/**
 * Interface used to define profile level permissions.
 */
export interface IProfilePermission extends IPermission<ProfileRelationRole> {}

/**
 * This interface defines permission context information required to verify profile level permission.
 */
export interface IProfilePermissionContext extends IPermissionContext<ProfileRelationRole> {
  settings: IPermissionSetting[];
  relationStatus?: UserStatus;
}
