import { IModule } from '@/core';
import { USER_INVITATIONS_MODULE_ID } from '@lyvely/core-interface';

export default () => {
  return {
    id: USER_INVITATIONS_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
  } as IModule;
};
