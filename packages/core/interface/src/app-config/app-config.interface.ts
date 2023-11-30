import { VisitorStrategy } from '@/users';

/**
 * This type describes
 */
export interface IAppConfig<TModuleView extends Record<string, object> = Record<string, object>> {
  appName: string;
  visitorStrategy: VisitorStrategy;
  docUrl: string;
  csrf_token?: string;
  modules: TModuleView;
}
