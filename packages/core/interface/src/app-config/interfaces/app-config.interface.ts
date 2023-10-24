/**
 * This type describes
 */
export interface IAppConfig<TModuleView extends Record<string, object> = Record<string, object>> {
  appName: string;
  docUrl: string;
  csrf_token?: string;
  modules: TModuleView;
}
