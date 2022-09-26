export interface IPermissionsService<TContext> {
  checkEveryPermission(user: TContext, ...permissions: string[]): Promise<boolean>;
  checkSomePermission(user: TContext, ...permissions: string[]): Promise<boolean>;
  checkPermission(user: TContext, permission: string): Promise<boolean>;
}
