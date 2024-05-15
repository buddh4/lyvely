import { ConfigurationPath } from '@/config';

export interface I18nConfigIF {
  modules: {
    i18n: {
      locales?: string[];
      fallback?: string;
    };
  };
}

export type I18nConfigPath = ConfigurationPath<I18nConfigIF>;
