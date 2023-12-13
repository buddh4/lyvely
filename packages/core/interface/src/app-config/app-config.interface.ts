import { IPermissionConfig } from '@/permissions';

/**
 * This type describes
 */
export interface IAppConfig<TModuleView extends Record<string, object> = Record<string, object>> {
  appName: string;
  permissions: IPermissionConfig;
  docUrl: string;
  csrf_token?: string;
  modules: TModuleView;
}
