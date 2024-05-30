import {
  IPermission,
  IPermissionObject,
  IPermissionSubject,
  IPermissionConfig,
} from './permissions.interface';

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
    config: TConfig
  ): boolean;
}
