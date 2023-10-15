import { IModule } from '@lyvely/web';

export default () => {
  return {
    getId: () => 'time-series',
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
  } as IModule;
};
