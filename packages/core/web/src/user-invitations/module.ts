import { IModule } from '@/core';
import { USER_INVITATIONS_MODULE_ID } from '@lyvely/core-interface';
import { registerComponentStackEntries, registerMenuEntries } from '@/ui';
import { STACK_PROFILE_LAYOUT } from '@/profiles';
import { MENU_ACCOUNT_DRAWER } from '@/user-accounts';
import { useSendInviteUsersStore } from '@/user-invitations/stores';

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
      registerMenuEntries(MENU_ACCOUNT_DRAWER, [
        {
          id: 'account-user-invite',
          sortOrder: 4000,
          moduleId: USER_INVITATIONS_MODULE_ID,
          icon: { name: 'paper-plane', autoScale: true },
          click: () => (useSendInviteUsersStore().showModal = true),
          text: 'invitations.account.title',
        },
      ]);
    },
  } as IModule;
};
