import { App } from 'vue';
import type { LocaleMessage } from '@intlify/core-base';
import { IFeature } from '@lyvely/interface';
import { RouteRecordRaw } from 'vue-router';

export interface IModule {
  id: string;
  features?: IFeature[] | (() => IFeature[]);
  routes?: RouteRecordRaw[] | (() => RouteRecordRaw[]);
  init?: () => void;
  install?: (app: App) => void;
  dependencies?: Array<IModule>;
  i18n?: {
    base?: (locale: string) => Promise<LocaleMessage>;
  } & { [k: string]: (locale: string) => Promise<LocaleMessage> };
  options?: Record<string, any>;
}
