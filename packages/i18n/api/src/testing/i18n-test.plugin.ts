import { TestPlugin } from '@lyvely/testing';
import { I18nModule as NestjsI18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { I18nModule } from '../i18n.module';
import { I18nModuleLoader } from '../loaders/i18n.module.loader';

export const i18nTestPlugin = {
  apply(builder) {
    builder.imports([
      I18nModule,
      NestjsI18nModule.forRoot({
        fallbackLanguage: 'en',
        loader: I18nModuleLoader,
        loaderOptions: {
          watch: false,
        },
        resolvers: [AcceptLanguageResolver],
      }),
    ]);
  },
} as TestPlugin;
