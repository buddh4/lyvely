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

export default () => {
  return {
    id: 'ui',
    routes: uiRoutes,
    init: () => {
      registerGuards([
        {
          on: 'beforeNavigate',
          guards: [showLoaderProgress],
        },
      ]);
      registerAfterNavigationHooks([
        showMobileNavGuard,
        closeMobileDrawerGuard,
        hideAppLoader,
        setPageTitle,
        hideLoaderProgress,
      ]);
    },
  } as IModule;
};
