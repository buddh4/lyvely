import { VisitorsDisabledStrategy, VisitorsEnabledStrategy } from '@/users';

/**
 * This type describes
 */
export interface IAppConfig<TModuleView extends Record<string, object> = Record<string, object>> {
  appName: string;
  visitors: VisitorsDisabledStrategy | VisitorsEnabledStrategy;
  docUrl: string;
  csrf_token?: string;
  modules: TModuleView;
}
