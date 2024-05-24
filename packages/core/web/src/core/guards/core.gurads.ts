import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { isDevelopEnvironment } from '../util';

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
