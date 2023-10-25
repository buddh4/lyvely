import { IModule, registerComponentStackEntry, STACK_PROFILE_LAYOUT } from '@lyvely/web';
import { ReloadPrompt } from '@/components';
import { PWA_MODULE_ID } from './pwa.constants';

export default () => {
  return {
    id: PWA_MODULE_ID,
    init() {
      registerComponentStackEntry(STACK_PROFILE_LAYOUT, ReloadPrompt);
    },
  } as IModule;
};