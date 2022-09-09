import { NavigationGuardNext, RouteLocation } from "vue-router";
import { useAuthStore } from '@/modules/user/store/auth.store';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { isDevelopEnvironment } from "@/modules/core/environment";
import { profileRoute } from "@/modules/profile/routes/profile-route.util";

// TODO: (GUESTS) - needs to be aligned for guest mode feature

export const toProfileHome = async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  const profileStore = useProfileStore();

  if(!profileStore.profile) {
    next('404');
    return;
  }

  // TODO: Use profile setting default route
  next(profileRoute('/activities', profileStore.profile.id));
}

export const loadProfile = async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  console.log('asdfasdfasfasdf');
  const profileStore = useProfileStore();

  // params.pid === ':pid: when profile root or main root path is accessed
  if(!to.params.pid || to.params.pid === ':pid') {
    // TODO: (stability) Handle error case if no profile was found
    const pid = (await profileStore.loadProfile())!.id;
    next(profileRoute('/', pid));
    return;
  }

  await useProfileStore().loadProfile(<string> to.params.pid);
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
