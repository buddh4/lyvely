import { IPermission, IPermissionObject, IPermissionSubject } from './permissions.interface';
import { IPermissionConfig } from '@/permissions';

export interface IPermissionsService<
  TPermission extends IPermission<any, any>,
  TSubject extends IPermissionSubject<TPermission['min']>,
  TObject extends IPermissionObject<TPermission['min']>,
  TConfig extends IPermissionConfig,
> {
  verifyPermission(
    permissionOrId: string | TPermission,
    subject: TSubject,
    object: TObject,
    config: TConfig,
  ): boolean;
}
