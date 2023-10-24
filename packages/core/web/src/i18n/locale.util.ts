import { ILocale } from '@lyvely/core-interface';
// TODO: this interface should not be part of app-config

export function getDefaultLocale(enabledLocales?: ILocale[]) {
  let result;

  if (navigator.languages?.length && enabledLocales) {
    result = navigator.languages.find((locale) => enabledLocales.find((l) => l.locale === locale));
  }

  // TODO: make default locale configurable
  return result || 'en-US';
}
