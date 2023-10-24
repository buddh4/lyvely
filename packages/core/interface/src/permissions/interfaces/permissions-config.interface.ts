import { IPermissionSetting } from './permission-setting.interface';

/**
 * Permission config used in app- and server-configuration.
 *
 * @example
 *
 * {
 *   defaults: [{ id: 'some-permission', role: GlobalPermissionRole.Admin }]
 *   allowVisitors: true
 * }
 */
export interface IPermissionConfig {
  /** Can be used to overwrite default permission roles **/
  defaults?: IPermissionSetting<any>[];

  /** If true will allow visitor roles in permission management  **/
  allowVisitors?: boolean;
}
