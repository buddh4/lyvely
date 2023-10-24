import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { isDevelopEnvironment } from '../environment';

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
