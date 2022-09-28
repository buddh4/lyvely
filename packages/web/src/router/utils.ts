import { NavigationGuardNext, RouteLocation } from "vue-router";
import { useAuthStore } from "@/modules/users/store/auth.store";
import { useProfileStore } from "@/modules/profiles/stores/profile.store";
import { isDevelopEnvironment } from "@/modules/core/environment";
import { profileRoute } from "@/modules/profiles/routes/profile-route.util";
import { isMultiUserProfile } from "@lyvely/common";

// TODO: (GUESTS) - needs to be aligned for guest mode feature

export const toProfileHome = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) => {
  const profileStore = useProfileStore();

  if (!profileStore.profile) {
    next("404");
    return;
  }

  // TODO: Use profile setting default route
  next(profileRoute("/activities", profileStore.profile.id));
};

export const loadProfile = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) => {
  const profileStore = useProfileStore();

  // params.pid === ':pid: when profile root or main root path is accessed
  if (!to.params.pid || to.params.pid === ":pid") {
    // TODO: (stability) Handle error case if no profile was found
    const profile = await profileStore.loadProfile();
    if (!profile) throw new Error("Profile could not be loaded");
    next(profileRoute("/", profile.id));
    return;
  }

  await useProfileStore().loadProfile(<string>to.params.pid);
  next();
};

export const ifIsMultiUserProfile = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) => {
  if (!isMultiUserProfile(useProfileStore().profile)) {
    next(profileRoute());
    return;
  }

  next();
};

export const ifNotAuthenticated = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
): void => {
  if (!useAuthStore().isAuthenticated) {
    next();
    return;
  }
  next("/");
};

export const ifAuthenticated = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
): void => {
  if (useAuthStore().isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

export const ifDevelopEnvironment = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
): void => {
  if (isDevelopEnvironment()) {
    next();
    return;
  }
  next("/404");
};
