import { IPermissionsService } from './permissions-service.interface';

export abstract class PermissionsService<TPermissionContext> implements IPermissionsService<TPermissionContext> {
  async checkEveryPermission(context: TPermissionContext, ...permissions: string[]): Promise<boolean> {
    const promises = permissions.map((permission) => this.checkPermission(context, permission));
    return !(await Promise.all(promises)).includes(false);
  }

  async checkSomePermission(context: TPermissionContext, ...permissions: string[]): Promise<boolean> {
    const promises = permissions.map((permission) => this.checkPermission(context, permission));
    return (await Promise.all(promises)).includes(true);
  }

  abstract checkPermission(context: TPermissionContext, permission: string): Promise<boolean>;
}
