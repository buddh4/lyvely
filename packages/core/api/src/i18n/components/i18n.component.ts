import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { I18nConfigPath, Translatable } from '../interfaces';
import { User } from '@/users';
import {
  DEFAULT_ENABLED_LOCALES,
  DEFAULT_FALLBACK_LOCALE,
  ILocaleDefinition,
  LOCALES_SUPPORTED,
  getLocaleDefinitions,
} from '@lyvely/interface';
import { setEnabledLocales } from '@lyvely/dates';

export interface ITranslationOptions {
  locale: string;
}

/**
 * This component is used for translating backend text and accessing locale configurations.
 */
@Injectable()
export class I18n {
  private logger = new Logger(I18n.name);

  constructor(
    private readonly configService: ConfigService<I18nConfigPath>,
    private readonly i18nService: I18nService
  ) {
    setEnabledLocales(this.getEnabledLocales());
  }

  /**
   * Creates a translatable object with pre-defined settings. This can be used as convenient function in case
   * multiple translations of a single module are required.
   *
   * Usage:
   *
   * ```typescript
   * const translations = this.i18n.translation(MY_MODULE_ID, user);
   * const text = translation.t('some-translation');
   * const test2 = translation.t('some-other-stranslation');
   * ```
   * @param module The module id used for translations.
   * @param optionsOrUser The translation options or a user.
   */
  public translation(module: string, optionsOrUser: ITranslationOptions | User) {
    return {
      t: (key: string, params?: Record<string, any>) =>
        this.t({ key: `${module}.${key}`, params }, optionsOrUser),
    };
  }

  /**
   * Translates the given translatable object with the given translation options or user settings.
   * @param translatable A translatable object or string.
   * @param optionsOrUser The translation options or a user object.
   */
  public t(translatable: Translatable, optionsOrUser: ITranslationOptions | User): string {
    const options =
      optionsOrUser instanceof User ? { locale: optionsOrUser.locale } : optionsOrUser;
    const lang = options.locale;
    if (typeof translatable === 'string') {
      return this.i18nService.t(translatable, { lang: options.locale });
    }

    return this.i18nService.t(translatable.key, {
      args: translatable.params,
      lang,
    });
  }

  /**
   * Returns an array of supported locales.
   * Those can be configured/restricted within the i18n module configuration under the path modules.i18n.locales.
   */
  public getEnabledLocales(): string[] {
    return this.configService
      .get('modules.i18n.locales', DEFAULT_ENABLED_LOCALES)
      .filter((locale) => LOCALES_SUPPORTED.includes(locale));
  }

  /**
   * Returns a fallback locale.
   * This can be configured within the i18n module configuration under the path modules.i18n.fallback.
   * Note, this locale need to be a supported and enabled locale otherwise the default is used.
   */
  public getFallbackLocale() {
    const locale = this.configService.get('modules.i18n.fallback', DEFAULT_FALLBACK_LOCALE);
    if (!this.getEnabledLocales().includes(locale)) {
      this.logger.error(`Invalid fallback locale configured: ${locale}`);
      return DEFAULT_FALLBACK_LOCALE;
    }
    return locale;
  }

  /**
   * Returns the enabled locale definitions which include the locale and a locale name.
   */
  public getEnabledLocaleDefinitions(): ILocaleDefinition[] {
    return getLocaleDefinitions(this.getEnabledLocales());
  }
}
