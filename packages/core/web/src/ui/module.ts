import { registerAfterNavigationHooks, registerGuards } from '@/lyvely.router';
import {
  closeMobileDrawerGuard,
  hideAppLoader,
  hideLoaderProgress,
  setPageTitle,
  showLoaderProgress,
  showMobileNavGuard,
} from './guards';
import { IModule } from '@/core';
import { uiRoutes } from '@/ui/routes';
import { registerMenuEntries } from '@/ui/menus';
import { MENU_ACCOUNT_DRAWER } from '@/user-accounts';
import { usePageStore } from './stores';
import { computed } from 'vue';
import { UI_MODULE_ID } from './ui.constants';

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
      ]);
      registerAfterNavigationHooks([
        showMobileNavGuard,
        closeMobileDrawerGuard,
        hideAppLoader,
        setPageTitle,
        hideLoaderProgress,
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
    },
  } as IModule;
};
