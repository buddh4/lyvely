import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { usePageStore } from '../stores';
import { isMaxViewSize } from '../helpers';
import NProgress from 'nprogress';

export const showLoaderProgress = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  if (to.name) NProgress.start();

  next();
};

export const hideLoaderProgress = (to: RouteLocation): void => {
  NProgress.done();
};

export const showMobileNavGuard = (to: RouteLocation): void => {
  usePageStore().showMobileFooter = to.meta.showMobileFooter !== false;
};

export const closeMobileDrawerGuard = (): void => {
  if (isMaxViewSize('sm')) {
    usePageStore().showSidebar = false;
  }
};

export const hideAppLoader = (): void => {
  usePageStore().setShowAppLoader(false);
};

export const setPageTitle = (to: RouteLocation): void => {
  if (to.meta?.title) usePageStore().setTitle(to.meta?.title());
};
