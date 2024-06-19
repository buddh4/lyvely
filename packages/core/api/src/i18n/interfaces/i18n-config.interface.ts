import type { ModuleConfig } from '@/core';

export interface I18nConfigIF {
  locales?: string[];
  fallback?: string;
}

export type I18nConfig = ModuleConfig<'i18n', I18nConfigIF>;
