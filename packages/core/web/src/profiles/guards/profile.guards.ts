import { useProfileStore } from '@/profiles/stores';
import { namedProfileRoute, profileRoute } from '@/profiles/routes/profile-route.util';
import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { isMultiUserProfile } from '@lyvely/core-interface';
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

export const loadProfileGuard = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  if (to.params.pid) {
    return loadProfileById(to, from, next);
  }

  if (to.meta?.profileView !== false) {
    return loadProfileByHandle(to, from, next);
  }

  next();
};

const loadProfileByHandle = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  const profileStore = useProfileStore();

  try {
    if ((!to.params.handle && to.path === '/') || to.params.handle === ':handle') {
      const profile = await profileStore.loadProfile();
      return next(profileRoute('/', profile.handle));
    } else if (!to.params.handle) {
      const profile = await profileStore.loadProfile();
      if (!profile) throw new Error('Profile could not be loaded');
      to.params.handle = profile.handle;
    }

    await useProfileStore().loadProfile(<string>to.params.handle);
    next();
  } catch (e) {
    if (e instanceof EntityNotFoundException) return next('/404');
    if (e instanceof ForbiddenServiceException) return next('/403');
    else return next('/500');
  }
};

const loadProfileById = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  const profileStore = useProfileStore();

  try {
    const profile = await profileStore.loadProfileById(to.params.pid as string);
    if (!profile) throw new Error('Profile could not be loaded');

    // TODO: check if feature is enabled on target profile + better default feature handling
    // Feature restrictions should probably be defined as route meta
    if (to.params.view) {
      next(namedProfileRoute(to.params.view as string, profile.handle));
    } else if (to.query.path) {
      next(profileRoute(to.query.path as string, profile.handle));
    } else {
      next(profileRoute('/', profile.handle));
    }
  } catch (e) {
    if (e instanceof EntityNotFoundException) return next('/404');
    if (e instanceof ForbiddenServiceException) return next('/403');
    else return next('/500');
  }
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
  next(profileRoute('/stream', profileStore.profile.handle));
};

export const setProfilePageTitleGuard = (to: RouteLocation): void => {
  if (to.meta?.title) useProfileStore().setPageTitle(to.meta?.title());
};
