import { App } from 'vue';
import type { LocaleMessage } from '@intlify/core-base';
import { IFeature, IPermission } from '@lyvely/interface';
import { RouteRecordRaw } from 'vue-router';

export interface IModule {
  id: string;
  permissions?: IPermission<any>[] | (() => IPermission<any>[]);
  features?: IFeature[] | (() => IFeature[]);
  routes?: RouteRecordRaw[] | (() => RouteRecordRaw[]);
  init?: () => void;
  icon?: string;
  install?: (app: App) => void;
  dependencies?: Array<IModule>;
  i18n?: {
    base?: (locale: string) => Promise<LocaleMessage>;
  } & { [k: string]: (locale: string) => Promise<LocaleMessage> };
  options?: Record<string, any>;
}
