import { useAuthStore } from '../stores';
import {
  NavigationGuardWithThis,
  NavigationGuardNext,
  RouteLocation,
  RouteLocationNormalized,
} from 'vue-router';
import { PATH_VERIFY_EMAIL } from '@/user-registration';
import { PATH_LOGIN, PATH_LOGOUT } from '../auth.constants';
import {
  ProfileVisibilityLevel,
  UnauthorizedServiceException,
  VisitorMode,
} from '@lyvely/interface';
import { PATH_403, PATH_500 } from '@/ui';
import { useAppConfigStore } from '@/app-config';

export const authGuard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const authStore = useAuthStore();

  // Pending logout required.
  if (authStore.hasLogoutToken()) return next(PATH_LOGOUT);

  // Restrict access for users which require email verification.
  if (
    authStore.isAwaitingEmailVerification() &&
    ![PATH_LOGIN, PATH_LOGOUT, PATH_VERIFY_EMAIL].includes(to.path)
  ) {
    return next(PATH_VERIFY_EMAIL);
  }

  // Always grant access to publicly accessible routes.
  if (to.meta?.isPublic) return next();

  // If not authenticated check visitor access.
  if (!authStore.isAuthenticated) {
    return handleVisitorAccess(to, from, next);
  }

  try {
    // Make sure out current user data is loaded e.g. on first load or manual reload.
    if (!to.meta?.isPublic && !authStore.user) {
      await authStore.loadUser();
    }
    next();
  } catch (err) {
    // Probably an expired auth+refresh token
    if (err instanceof UnauthorizedServiceException) {
      await authStore.logout();
    } else {
      next(PATH_500);
    }
  }
};

/**
 * This function handles the navigation of non-authenticated users (visitors) for non-public routes.
 * If the configuration does not allow visitors we redirect them to the login screen.
 * If the configuration allows visitors we check the routes visibility level which needs to be either not defined (default)
 * or equal to ProfileVisibilityLevel.Visitor.
 * @param next
 */
function handleVisitorAccess(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  if (to.params.handle && to.path === '/') return next(PATH_LOGIN);

  const visitorStrategy = useAppConfigStore().getModuleConfig('permissions')?.visitorStrategy;

  // We use Visitor as default visibility, protected routes need to be explicitly protected.
  const routeVisibility = to.meta?.visibility ?? ProfileVisibilityLevel.Visitor;
  if (visitorStrategy?.mode !== VisitorMode.Enabled) {
    return next(PATH_LOGIN);
  } else if (routeVisibility < ProfileVisibilityLevel.Visitor) {
    return next(PATH_403);
  } else {
    // Let the profile or another guard handle the visitor access.
    return next();
  }
}

export const ifNotAuthenticated = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
): void => {
  if (!useAuthStore().isAuthenticated) {
    next();
    return;
  }
  next('/');
};
