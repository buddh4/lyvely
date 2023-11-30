/**
 * Defines a permission setting state e.g. in profile settings or configuration.
 */
export interface IPermissionSetting<IRole = string> {
  id: string;
  role: IRole;
}
