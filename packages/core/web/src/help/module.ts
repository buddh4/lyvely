import { registerAfterNavigationHooks } from '@/lyvely.router';

import { IModule } from '@/core';
import { showHelpAfterNavigationHook } from '@/help/guards';
import { registerMenuEntries, registerComponentStackEntries } from '@lyvely/ui';
import { STACK_PROFILE_LAYOUT } from '@/profiles';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useHelpStore, useIntroductionTourStore } from '@/help/stores';
import { MENU_ACCOUNT_DRAWER } from '@/user-accounts';
import { HELP_MODULE_ID } from '@/help/help.constants';

export default () => {
  return {
    id: HELP_MODULE_ID,
    init: () => {
      registerAfterNavigationHooks([showHelpAfterNavigationHook]);
      registerComponentStackEntries(STACK_PROFILE_LAYOUT, [
        {
          id: 'IntroductionTour',
          component: () => import('./components/IntroductionTour.vue'),
          condition: computed(() => {
            const { active } = storeToRefs(useIntroductionTourStore());
            return active.value;
          }),
        },
        {
          id: 'HelpModal',
          component: () => import('./components/HelpModal.vue'),
        },
      ]);
      registerMenuEntries(MENU_ACCOUNT_DRAWER, [
        {
          id: 'account-help',
          sortOrder: 2000,
          moduleId: HELP_MODULE_ID,
          icon: 'help',
          click: () => useHelpStore().setShowModal(true),
          text: 'help.label',
        },
      ]);
    },
  } as IModule;
};
