import { useProfileStore } from '@/profiles/stores';
import { profilePathRoute } from '@/profiles/routes/profile-route.helper';
import { NavigationGuardNext, RouteLocation } from 'vue-router';
import {
  isMultiUserProfile,
  DocumentNotFoundException,
  ForbiddenServiceException,
  UnauthorizedServiceException,
} from '@lyvely/interface';
import { PATH_LOGIN, PATH_LOGOUT, useAuthStore } from '@/auth';
import { PATH_403, PATH_404, PATH_500 } from '@/ui';

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

export const loadProfileGuard = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  // Ignore routes not related to profiles
  if (to.meta?.isPublic) return next();

  try {
    // Load profile by id or handle
    if (to.params.pid) {
      await loadProfileById(to, from, next);
    } else {
      await loadProfileByHandle(to, from, next);
    }
  } catch (e) {
    if (e instanceof UnauthorizedServiceException) return next(PATH_LOGOUT);
    if (e instanceof DocumentNotFoundException) return next(PATH_404);
    if (e instanceof ForbiddenServiceException) return next(PATH_403);
    else return next(PATH_500);
  }
};

const loadProfileByHandle = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
) => {
  const profileStore = useProfileStore();
  if ((!to.params.handle && to.path === '/') || to.params.handle === ':handle') {
    const profile = await profileStore.loadProfile();
    const { help } = to.query;
    return next(profileStore.getRoute(null, profile.handle, { help }));
  }

  const handle: string = typeof to.params.handle === 'string' ? to.params.handle : undefined;
  await profileStore.loadProfile(handle);
  next();
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
  const profile = await profileStore.loadProfileById(to.params.pid as string);
  if (!profile) throw new Error('Profile could not be loaded');

  const query = { ...to.query };
  const path = query.path;
  delete query['path'];

  /**
   * TODO: check if feature is enabled on target profile + better default feature handling
   * Feature restrictions should probably be defined as route meta
   */
  if (typeof to.params.view === 'string' && to.params.view.length) {
    next(profileStore.getRoute(to.params.view, profile.handle, query));
  } else if (typeof path === 'string') {
    next(profilePathRoute(profile.handle, path));
  } else {
    next(profileStore.getRoute(null, profile.handle, query));
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
