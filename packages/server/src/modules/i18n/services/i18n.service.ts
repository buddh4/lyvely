import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const availableLocales = ['en-US', 'de-DE'];
const localeNames = {
  'en-US': 'English',
  'de-DE': 'Deutsch',
};

@Injectable()
export class I18nService {
  constructor(private readonly configService: ConfigService) {}

  public getAvailableLocales() {
    return availableLocales;
  }

  public getEnabledLocales() {
    return this.configService
      .get('i18n.locales', availableLocales)
      .filter((locale) => availableLocales.includes(locale));
  }

  public getEnabledLocaleDefinitions() {
    return this.getEnabledLocales().map((locale) => ({ locale: locale, name: localeNames[locale] }));
  }
}
