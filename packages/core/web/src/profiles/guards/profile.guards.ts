import { useProfileStore } from '@/profiles/stores';
import { profileRoute } from '@/profiles/routes/profile-route.util';
import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { isMultiUserProfile } from '@lyvely/core-interface';
import { DialogExceptionHandler } from '@/core';
import { EntityNotFoundException, ForbiddenServiceException } from '@lyvely/common';

export const ifIsMultiUserProfile = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  if (!isMultiUserProfile(useProfileStore().profile)) {
    next(profileRoute());
    return;
  }

  next();
};

export const loadProfile = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  const profileStore = useProfileStore();

  try {
    // params.pid === ':pid: when profile root or main root path is accessed
    if ((!to.params.pid && to.path === '/') || to.params.pid === ':pid') {
      // TODO: (stability) Handle error case if no profile was found

      const profile = await profileStore.loadProfile();
      return next(profileRoute('/', profile.id));
    } else if (!to.params.pid) {
      const profile = await profileStore.loadProfile();
      if (!profile) throw new Error('Profile could not be loaded');
      to.params.pid = profile.id;
    }

    await useProfileStore().loadProfile(<string>to.params.pid);
    next();
  } catch (e) {
    if (e instanceof EntityNotFoundException) return next('/404');
    if (e instanceof ForbiddenServiceException) return next('/403');
    else return next('/500');
  }
};

export const loadProfileGuard = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  if (to.meta?.profileView !== false) {
    return loadProfile(to, from, next);
  }

  next();
};

export const toProfileHome = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  const profileStore = useProfileStore();

  if (!profileStore.profile) {
    next('404');
    return;
  }

  // TODO: Use profile setting default route
  next(profileRoute('/stream', profileStore.profile.id));
};

export const setPageTitle = (to: RouteLocation): void => {
  if (to.meta?.title) useProfileStore().setPageTitle(to.meta?.title());
};
