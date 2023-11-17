import { ConfigurationPath } from '@/config';

export interface I18nConfig {
  modules: {
    i18n: {
      locales?: string[];
      fallback?: string;
    };
  };
}

export type I18nConfigPath = ConfigurationPath<I18nConfig>;
