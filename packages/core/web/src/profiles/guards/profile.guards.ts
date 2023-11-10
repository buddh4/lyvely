import { useProfileStore } from '@/profiles/stores';
import { profilePathRoute } from '@/profiles/routes/profile-route.helper';
import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { isMultiUserProfile } from '@lyvely/core-interface';
import { EntityNotFoundException, ForbiddenServiceException } from '@lyvely/common';

export const ifIsMultiUserProfile = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  if (!isMultiUserProfile(useProfileStore().profile)) {
    // TODO: Maybe use a profile internal 404 page here
    next('404');
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
      return next(profileStore.getRoute(null, profile.handle));
    } else if (!to.params.handle) {
      const profile = await profileStore.loadProfile();
      if (!profile) throw new Error('Profile could not be loaded');
      to.params.handle = profile.handle;
    } else {
      await useProfileStore().loadProfile(<string>to.params.handle);
    }

    next();
  } catch (e) {
    if (e instanceof EntityNotFoundException) return next('/404');
    if (e instanceof ForbiddenServiceException) return next('/403');
    else return next('/500');
  }
};

/**
 * This is used for profile id path navigations like /pid/:pid?view=ViewName.
 * This is mainly used if the caller does not know the handle of the profile and don't want to manually load the profile,
 * e.g. in notifications or navigating from profile relations.
 * @param to
 * @param from
 * @param next
 */
const loadProfileById = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  const profileStore = useProfileStore();

  try {
    const profile = await profileStore.loadProfileById(to.params.pid as string);
    if (!profile) throw new Error('Profile could not be loaded');

    const query = { ...to.query };
    delete query['path'];

    /**
     * TODO: check if feature is enabled on target profile + better default feature handling
     * Feature restrictions should probably be defined as route meta
     */
    if (typeof to.params.view === 'string') {
      next(profileStore.getRoute(to.params.view, profile.handle, query));
    } else if (typeof to.query.path === 'string') {
      next(profilePathRoute(to.query.path, profile.handle));
    } else {
      next(profileStore.getRoute(null, profile.handle, query));
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
  next(useProfileStore().getRoute());
};

export const setProfilePageTitleGuard = (to: RouteLocation): void => {
  if (to.meta?.title) useProfileStore().setPageTitle(to.meta?.title());
};
