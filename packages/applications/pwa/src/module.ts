import { IModule, STACK_PROFILE_LAYOUT } from '@lyvely/web';
import { registerComponentStackEntry } from '@lyvely/ui';
import ReloadPrompt from '@/components/ReloadPrompt.vue';
import { PWA_MODULE_ID } from './pwa.constants';

export default () => {
  return {
    id: PWA_MODULE_ID,
    init() {
      registerComponentStackEntry(STACK_PROFILE_LAYOUT, {
        id: 'pwa-reload-prompt',
        component: ReloadPrompt,
      });
    },
  } as IModule;
};
