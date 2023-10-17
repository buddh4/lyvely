import { IModule } from '@/core';
import { USER_INVITATIONS_MODULE_ID } from '@lyvely/core-interface';
import { registerComponentStackEntries } from '@/ui';
import { STACK_PROFILE_LAYOUT } from '@/profiles';

export default () => {
  return {
    id: USER_INVITATIONS_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    init() {
      registerComponentStackEntries(STACK_PROFILE_LAYOUT, [
        {
          id: 'InviteUsersModal',
          component: () => import('./components/InviteUsersModal.vue'),
        },
      ]);
    },
  } as IModule;
};
