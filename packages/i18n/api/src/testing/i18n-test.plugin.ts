import { TestPlugin } from '@lyvely/testing';
import { I18nModule as NestJsI18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { I18nModule } from '../i18n.module';
import { I18nModuleLoader } from '../loaders/i18n.module.loader';

export const i18nTestPlugin = {
  apply(builder) {
    builder
      .imports([
        I18nModule,
        NestJsI18nModule.forRoot({
          fallbackLanguage: 'en',
          loader: I18nModuleLoader,
          loaderOptions: {
            watch: false,
          },
          resolvers: [AcceptLanguageResolver],
        }),
      ])
      .config({
        modules: {
          i18n: {
            locales: ['en', 'de'],
          },
        },
      });
  },
} as TestPlugin;
