import { IModule } from '@/core';
import { USER_INVITATIONS_MODULE_ID } from '@lyvely/interface';
import { registerComponentStackEntries, registerMenuEntry } from '@lyvely/ui';
import { STACK_PROFILE_LAYOUT } from '@/profiles';
import { MENU_ACCOUNT_DRAWER } from '@/user-account';
import { useSendInviteUsersStore } from '@/user-invitations/stores';
import { useAuthStore } from '@/auth';

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
      registerMenuEntry(MENU_ACCOUNT_DRAWER, () => ({
        id: 'account-user-invite',
        sortOrder: 4000,
        moduleId: USER_INVITATIONS_MODULE_ID,
        icon: 'paper-plane',
        condition: useAuthStore().isAuthenticated,
        iconBindings: { autoScale: true },
        click: () => (useSendInviteUsersStore().showModal = true),
        text: 'invitations.account.title',
      }));
    },
  } as IModule;
};
