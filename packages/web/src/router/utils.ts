import { NavigationGuardNext, RouteLocation } from "vue-router";
import { useAuthStore } from '@/modules/user/store/auth.store';
import { useProfileStore } from '@/modules/user/store/profile.store';

// TODO: GUEST - needs to be aligned for guest mode feature

export const loadProfile = async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  const profileStore = useProfileStore();

  if(!to.query.pid) {
    to.query.pid = (await profileStore.loadProfile()).id;
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
  if (import.meta.env.MODE === 'development') {
    next();
    return;
  }
  next("/404");
};
