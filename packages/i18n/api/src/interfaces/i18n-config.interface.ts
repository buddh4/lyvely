import { ConfigurationPath } from '@lyvely/core';

export interface I18nConfig {
  modules: {
    i18n: {
      locales: string[];
    };
  };
}

export type I18nConfigPath = ConfigurationPath<I18nConfig>;
