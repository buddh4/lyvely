import { registerAfterNavigationHooks, registerGuards } from '@/lyvely.router';
import { errorDialogErrorInterceptor } from './interceptors';
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
import {
  registerMenuEntries,
  LyFlashMessage,
  registerComponentStackEntries,
  registerLayouts,
} from '@lyvely/ui';
import { MENU_ACCOUNT_DRAWER } from '@/user-accounts';
import { useFlashStore, usePageStore } from './stores';
import { computed } from 'vue';
import { LAYOUT_INTRO, STACK_MAIN, UI_MODULE_ID } from './ui.constants';
import { useApiResponseInterceptor } from '@lyvely/interface';

export const uiModule = () => {
  return {
    id: UI_MODULE_ID,
    routes: uiRoutes,
    init: () => {
      useApiResponseInterceptor(undefined, errorDialogErrorInterceptor);
      registerComponentStackEntries(STACK_MAIN, [
        {
          id: 'ui-flash',
          component: LyFlashMessage,
          props: {
            modelValue: computed({
              get: () => useFlashStore().show,
              set: (val: boolean) => (useFlashStore().show = val),
            }),
            text: computed(() => useFlashStore().message),
            type: computed(() => useFlashStore().type),
            manual: computed(() => useFlashStore().isManual),
          },
        },
      ]);
      registerGuards([
        {
          on: 'beforeNavigate',
          guard: showLoaderProgress,
        },
        {
          on: 'beforeNavigate',
          guard: showLoaderProgress,
        },
        resolveLayoutGuard,
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
