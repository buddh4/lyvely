import { useAuthStore } from "@/modules/auth/store/auth.store";
import { NavigationGuardWithThis, RouteLocationNormalized } from "vue-router";
import { PATH_VERIFY_EMAIL } from "@/modules/user-registration/routes";
import { PATH_LOGIN, PATH_LOGOUT } from "@/modules/auth/routes";

const PATH_ROOT = "/";
const publicRoutes = [PATH_ROOT, PATH_LOGIN];

function isPublicRoue(route: RouteLocationNormalized) {
  return route.meta?.isPublic || publicRoutes.includes(route.path);
}

const util: NavigationGuardWithThis<undefined> = (to, from, next) => {
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

  Promise.all(promises)
    .then(() => next())
    .catch((err) => {
      if (err?.response?.status === 401) {
        authStore.logout();
      }
    });
};

export default util;
