import { NavigationGuardNext, RouteLocation } from "vue-router";
import { useAuthStore } from '@/modules/user/store/auth.store';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { isDevelopEnvironment } from "@/modules/core/environment";

// TODO: (GUESTS) - needs to be aligned for guest mode feature

export const loadProfile = async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  const profileStore = useProfileStore();

  if(!to.query.pid) {
    // TODO: (stability) Handle error
    to.query.pid = (await profileStore.loadProfile())!.id;
    next(to);
    return;
  }

  await useProfileStore().loadProfile(<string> to.query?.pid);
  next();
};

export const ifNotAuthenticated = (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext): void => {
  if (!useAuthStore().isAuthenticated) {
    next();
    return;
  }
  next("/");
};

export const ifAuthenticated = (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext): void => {
  if (useAuthStore().isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

export const ifDevelopEnvironment = (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext): void => {
  if (isDevelopEnvironment()) {
    next();
    return;
  }
  next("/404");
};
