import { useAuthStore } from '../store';
import {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  NavigationGuardNext,
  RouteLocation,
} from 'vue-router';
import { PATH_VERIFY_EMAIL } from '@/user-registration';
import { PATH_LOGIN, PATH_LOGOUT } from '../auth.constants';
import { UnauthorizedServiceException } from '@lyvely/common';
import { PATH_500 } from '@/ui';

const PATH_ROOT = '/';
const publicRoutes = [PATH_ROOT, PATH_LOGIN];

function isPublicRoue(route: RouteLocationNormalized) {
  return route.meta?.isPublic || publicRoutes.includes(route.path);
}

export const authGuard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const promises: Promise<any>[] = [];
  const authStore = useAuthStore();

  if (
    authStore.isAwaitingEmailVerification() &&
    ![PATH_LOGIN, PATH_LOGOUT, PATH_VERIFY_EMAIL].includes(to.path)
  ) {
    next(PATH_VERIFY_EMAIL);
    return;
  }

  // TODO: GUEST - needs to be aligned for guest mode feature
  if (!authStore.isAuthenticated && !isPublicRoue(to)) {
    next(PATH_LOGIN);
    return;
  }

  if ([PATH_LOGIN, PATH_LOGOUT].includes(to.path)) {
    next();
    return;
  }

  if (!isPublicRoue(to) && !authStore.user) {
    // Load user data if not in state, e.g. manual on page reload
    promises.push(authStore.loadUser());
  }

  try {
    await Promise.all(promises);
    next();
  } catch (err) {
    if (err instanceof UnauthorizedServiceException) {
      await authStore.logout();
    } else {
      next(PATH_500);
    }
  }
};

export const ifNotAuthenticated = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
): void => {
  if (!useAuthStore().isAuthenticated) {
    next();
    return;
  }
  next('/');
};
