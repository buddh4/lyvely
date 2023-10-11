import { isDevelopEnvironment } from '../environment';
import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { usePageStore } from '../store';
import { isMaxViewSize } from '../util';

export const ifDevelopEnvironment = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
): void => {
  if (isDevelopEnvironment()) {
    next();
    return;
  }
  next('/404');
};

export const showMobileNavGuard = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
): void => {
  usePageStore().showMobileFooter = to.meta.showMobileFooter !== false;
  next();
};

export const closeMobileDrawerGuard = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
): void => {
  if (isMaxViewSize('sm')) {
    usePageStore().showSidebar = false;
  }

  next();
};
