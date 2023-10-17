import { registerAfterNavigationHooks } from '@/lyvely.router';

import { IModule } from '@/core';
import { showHelpAfterNavigationHook } from '@/help/guards';
import { registerComponentStackEntries } from '@/ui';
import { STACK_PROFILE_LAYOUT } from '@/profiles';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useIntroductionTourStore } from '@/help/stores';

export default () => {
  return {
    id: 'help',
    init: () => {
      registerComponentStackEntries(STACK_PROFILE_LAYOUT, [
        {
          id: 'IntroductionTour',
          component: () => import('./components/IntroductionTour.vue'),
          condition: computed(() => {
            const { active } = storeToRefs(useIntroductionTourStore());
            return active;
          }),
        },
        {
          id: 'HelpModal',
          component: () => import('./components/HelpModal.vue'),
        },
      ]);
      registerAfterNavigationHooks([showHelpAfterNavigationHook]);
    },
  } as IModule;
};
