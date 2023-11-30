import { IPermissionSetting } from './permission-setting.interface';

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
}

/**
 * This interface is used when verifying permissions.
 * The visitorsAllowed property defines if the platform allows visitors, which is usually configured
 * in the backend.
 */
export interface IPermissionOptions extends IPermissionConfig {
  visitorsAllowed: boolean;
}
