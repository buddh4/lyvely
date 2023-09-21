import { locale } from 'dayjs';
import { ILocale } from '@lyvely/common';

import de from 'dayjs/locale/de';

export default function init(): void {
  // TODO: only load user locales
  locale(de);
}

export function getDefaultLocale(enabledLocales?: ILocale[]) {
  let result;

  if (navigator.languages?.length && enabledLocales) {
    result = navigator.languages.find((locale) => enabledLocales.find((l) => l.locale === locale));
  }

  // TODO: make default locale configurable
  return result || 'en-US';
}
