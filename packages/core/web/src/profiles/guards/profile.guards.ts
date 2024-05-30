import { useProfileStore } from '@/profiles/stores';
import { profilePathRoute } from '@/profiles/routes/profile-route.helper';
import { NavigationGuardNext, RouteLocation } from 'vue-router';
import {
  isMultiUserProfile,
  DocumentNotFoundException,
  ForbiddenServiceException,
  UnauthorizedServiceException,
  verifyProfileVisibilityLevel,
  verifyProfileRoleLevel,
} from '@lyvely/interface';
import { PATH_LOGOUT } from '@/auth';
import { PATH_403, PATH_404, PATH_500 } from '@/ui';
import { isNil } from '@lyvely/common';

export const ifIsMultiUserProfile = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) => {
  if (!isMultiUserProfile(useProfileStore().profile)) {
    // TODO: Maybe use a profile internal 404 page here
    next('404');
    return;
  }

  next();
};

/**
 * Loads a profile based on the route parameters, either by pid or handle or the default profile unless
 * the route is marked with the `isPublic` meta flag.
 *
 * If we receive a UnauthorizedServiceException this guard redirects to the login page.
 * In case of other errors we redirect to error specific error pages.
 *
 * Note: We require a profile to be loaded in most cases, even for non profile routes like account, since the
 * profile layout will still be active in such cases. Currently, only public routes marked with `isPublic` do not
 * require a profile to be loaded.
 *
 * @param {RouteLocation} to – The target route that the user is navigating to.
 * @param {RouteLocation} from – The current route that the user is navigating from.
 * @param {NavigationGuardNext} next – The next middleware function to invoke.
 * @returns {Promise<void>} – A Promise that resolves when the profile information is loaded.
 */
export const loadProfileGuard = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
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

    const userRole = useProfileStore().profile!.role;
    if (!isNil(to.meta.visibility) && !verifyProfileVisibilityLevel(userRole, to.meta.visibility)) {
      next(PATH_403);
    }

    if (!isNil(to.meta.role) && !verifyProfileRoleLevel(userRole, to.meta.role)) {
      next(PATH_403);
    }
  } catch (e) {
    if (e instanceof UnauthorizedServiceException) next(PATH_LOGOUT);
    if (e instanceof DocumentNotFoundException) next(PATH_404);
    if (e instanceof ForbiddenServiceException) next(PATH_403);
    else next(PATH_500);
  }
};

/**
 * Load profile by handle.
 *
 * @param {RouteLocation} to - The target route location.
 * @param {RouteLocation} from - The source route location.
 * @param {NavigationGuardNext} next - The next navigation hook.
 * @returns {Promise<void>} - A Promise that resolves when the profile is loaded.
 */
const loadProfileByHandle = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) => {
  const profileStore = useProfileStore();
  if ((!to.params.handle && to.path === '/') || to.params.handle === ':handle') {
    const profile = await profileStore.loadProfile();
    const { help } = to.query;
    return next(profileStore.getRoute(null, profile.handle, { help }));
  }

  const handle: string | undefined =
    typeof to.params.handle === 'string' ? to.params.handle : undefined;
  await profileStore.loadProfile(handle);

  // We need this e.g. for non profile routes otherwise we get a missing required parameter error by the router.
  to.params['handle'] = handle || ':handle';
  next();
};

/**
 * This is used for profile id path navigations like /pid/:pid?view=ViewName.
 * This is mainly used if the caller does not know the handle of the profile and don't want to manually load the profile,
 * e.g. in notifications or navigating from profile relations.
 *
 * @param to
 * @param from
 * @param next
 */
const loadProfileById = async (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
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
  next: NavigationGuardNext
) => {
  next(useProfileStore().getRoute());
};

export const setProfilePageTitleGuard = (to: RouteLocation): void => {
  if (to.meta?.title) useProfileStore().setPageTitle(to.meta?.title());
};
