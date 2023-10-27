import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { I18nConfigPath, Translatable } from '../interfaces';
import { User } from '@/users';

const availableLocales = ['en-US', 'de-DE'];
const localeNames = {
  'en-US': 'English',
  'de-DE': 'Deutsch',
};

export interface TranslationOptions {
  locale: string;
}

@Injectable()
export class I18n {
  constructor(
    private readonly configService: ConfigService<I18nConfigPath>,
    private readonly i18nService: I18nService,
  ) {}

  public getAvailableLocales() {
    return availableLocales;
  }

  public translation(module: string, optionsOrUser: TranslationOptions | User) {
    return {
      t: (key: string, params?: Record<string, any>) =>
        this.t({ key: `${module}.${key}`, params }, optionsOrUser),
    };
  }

  public t(translatable: Translatable, optionsOrUser: TranslationOptions | User): string {
    const options =
      optionsOrUser instanceof User ? { locale: optionsOrUser.locale } : optionsOrUser;
    // https://github.com/toonvanstrijp/nestjs-i18n/issues/429
    const lang = options.locale.split('-')[0];
    if (typeof translatable === 'string') {
      return this.i18nService.t(translatable, { lang });
    }

    return this.i18nService.t(translatable.key, {
      args: translatable.params,
      lang,
    });
  }

  public getEnabledLocales() {
    return this.configService
      .get('modules.i18n.locales', availableLocales)
      .filter((locale) => availableLocales.includes(locale));
  }

  public getEnabledLocaleDefinitions() {
    return this.getEnabledLocales().map((locale) => ({
      locale: locale,
      name: localeNames[locale],
    }));
  }
}
