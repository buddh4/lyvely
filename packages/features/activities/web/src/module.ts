import { IModule } from '@lyvely/web';

export default () => {
  return {
    getId: () => 'activities',
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
  } as IModule;
};
