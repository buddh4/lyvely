import { App } from 'vue';
import type { LocaleMessage } from '@intlify/core-base';

export interface IModule {
  getId: () => string;
  init?: () => void;
  install?: (app: App) => void;
  i18n?: {
    base?: (locale: string) => Promise<LocaleMessage>;
  } & { [k: string]: (locale: string) => Promise<LocaleMessage> };
  options?: Record<string, any>;
}
