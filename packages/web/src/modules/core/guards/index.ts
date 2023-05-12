import { isDevelopEnvironment } from '@/modules/core/environment';
import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { usePageStore } from '@/modules/core/store/page.store';

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
