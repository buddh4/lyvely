import { registerAfterNavigationHooks, registerGuards } from '@/lyvely.router';
import {
  closeMobileDrawerGuard,
  hideAppLoader,
  hideLoaderProgress,
  resolveLayoutGuard,
  setHasHistory,
  showLoaderProgress,
  showMobileNavGuard,
} from './guards';
import { IModule } from '@/core';
import { uiRoutes } from '@/ui/routes';
import { registerMenuEntries } from '@/ui/menus';
import { MENU_ACCOUNT_DRAWER } from '@/user-accounts';
import { useFlashStore, usePageStore } from './stores';
import { computed, shallowRef } from 'vue';
import { LAYOUT_INTRO, STACK_MAIN, UI_MODULE_ID } from './ui.constants';
import { registerLayouts } from './layouts';
import { registerComponentStackEntries } from '@/ui/component-stack';
import LyFlashMessage from '@/ui/components/LyFlashMessage.vue';

export default () => {
  return {
    id: UI_MODULE_ID,
    routes: uiRoutes,
    init: () => {
      registerGuards([
        {
          on: 'beforeNavigate',
          guard: showLoaderProgress,
        },
        resolveLayoutGuard,
      ]);

      registerComponentStackEntries(STACK_MAIN, [
        {
          id: 'ui-flash',
          component: LyFlashMessage,
          props: {
            modelValue: computed({
              get: () => useFlashStore().show,
              set: (val: boolean) => (useFlashStore().show = val),
            }),
            message: computed(() => useFlashStore().message),
            type: computed(() => useFlashStore().type),
            manual: computed(() => useFlashStore().isManual),
          },
        },
      ]);
      registerAfterNavigationHooks([
        showMobileNavGuard,
        closeMobileDrawerGuard,
        hideAppLoader,
        hideLoaderProgress,
        setHasHistory,
      ]);
      registerMenuEntries(MENU_ACCOUNT_DRAWER, [
        {
          id: 'dark-mode-toggle',
          sortOrder: 3000,
          moduleId: UI_MODULE_ID,
          icon: computed(() => (usePageStore().isDark ? 'light-mode' : 'dark-mode')),
          click: () => usePageStore().toggleDark(),
          text: computed(() => (usePageStore().isDark ? 'page.toLightMode' : 'page.toDarkMode')),
        },
      ]);
      registerLayouts([
        {
          id: LAYOUT_INTRO,
          component: () => import('./layouts/IntroLayout.vue'),
        },
      ]);
    },
  } as IModule;
};
