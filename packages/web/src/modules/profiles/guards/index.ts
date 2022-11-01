import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { NavigationGuardNext, RouteLocation } from 'vue-router';
import { isMultiUserProfile } from '@lyvely/common';

export const ifIsMultiUserProfile = async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  if (!isMultiUserProfile(useProfileStore().profile)) {
    next(profileRoute());
    return;
  }

  next();
};

export const loadProfile = async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  const profileStore = useProfileStore();

  // params.pid === ':pid: when profile root or main root path is accessed
  if ((!to.params.pid && to.path === '/') || to.params.pid === ':pid') {
    // TODO: (stability) Handle error case if no profile was found
    const profile = await profileStore.loadProfile();
    if (!profile) throw new Error('Profile could not be loaded');

    next(profileRoute('/', profile.id));
    return;
  } else if (!to.params.pid) {
    const profile = await profileStore.loadProfile();
    if (!profile) throw new Error('Profile could not be loaded');
    to.params.pid = profile.id;
  }

  await useProfileStore().loadProfile(<string>to.params.pid);
  next();
};

export const toProfileHome = async (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  const profileStore = useProfileStore();

  if (!profileStore.profile) {
    next('404');
    return;
  }

  // TODO: Use profile setting default route
  next(profileRoute('/activities', profileStore.profile.id));
};
