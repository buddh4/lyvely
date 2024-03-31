import { registerAfterNavigationHooks, registerGuards } from '@/lyvely.router';
import routes from './routes/profile.routes';
import { loadProfileGuard, setProfilePageTitleGuard } from './guards';
import { registerComponentStackEntries, registerLayouts, registerMenuEntries } from '@lyvely/ui';
import {
  LAYOUT_PROFILE,
  LAYOUT_PROFILE_FULL,
  LAYOUT_PROFILE_SETTINGS,
  LAYOUT_PROFILE_XL,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_SETTINGS,
  STACK_PROFILE_LAYOUT,
} from '@/profiles/profile.constants';
import {
  ProfileRelationRole,
  PROFILES_MODULE_ID,
  useApiRequestInterceptor,
} from '@lyvely/interface';
import { useProfileStore } from '@/profiles/stores';
import { IModule } from '@/core';
import { profileIdInterceptor } from './interceptors';

export const profilesModule = () => {
  return {
    id: PROFILES_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      i18n: (locale: string) => import(`./locales/i18n.${locale}.json`),
      settings: (locale: string) => import(`./locales/settings.${locale}.json`),
    },
    routes,
    init: () => {
      useApiRequestInterceptor(profileIdInterceptor);
      registerGuards([loadProfileGuard]);
      registerAfterNavigationHooks([setProfilePageTitleGuard]);
      registerLayouts([
        {
          id: LAYOUT_PROFILE,
          component: () => import('./layouts/ProfileLayout.vue'),
          props: {},
        },
        {
          id: LAYOUT_PROFILE_XL,
          component: () => import('./layouts/ProfileLayout.vue'),
          props: { containerWidth: 'xl' },
        },
        {
          id: LAYOUT_PROFILE_FULL,
          component: () => import('./layouts/ProfileLayout.vue'),
          props: { containerWidth: 'full' },
        },
        {
          id: LAYOUT_PROFILE_SETTINGS,
          component: () => import('./layouts/ProfileSettingsLayout.vue'),
        },
      ]);
      registerComponentStackEntries(STACK_PROFILE_LAYOUT, [
        {
          id: 'CreateProfileModal',
          component: () => import('./components/modals/CreateProfileModal.vue'),
        },
      ]);
      registerMenuEntries(MENU_PROFILE_DRAWER, [
        () => ({
          id: 'profileUsers',
          moduleId: PROFILES_MODULE_ID,
          to: { name: 'ProfileUsers' },
          icon: 'users',
          sortOrder: 3000,
          text: 'profiles.users.label',
          condition: useProfileStore().isMultiUserProfile(),
        }),
        () => ({
          id: 'profileSettings',
          moduleId: PROFILES_MODULE_ID,
          to: { name: 'ProfileSettings' },
          condition: useProfileStore().isMember(),
          icon: 'settings',
          sortOrder: 4000,
          text: 'profiles.settings.label',
        }),
      ]);

      // TODO: Permissions
      registerMenuEntries(MENU_PROFILE_SETTINGS, [
        () => ({
          id: 'profileMembership',
          moduleId: PROFILES_MODULE_ID,
          text: 'profiles.settings.membership.label',
          condition: useProfileStore().isMember(),
          sortOrder: 1000,
          to: { name: 'ProfileMembershipSettings' },
        }),
        () => ({
          id: 'generalProfileSettings',
          moduleId: PROFILES_MODULE_ID,
          text: 'profiles.settings.general.label',
          condition: useProfileStore().verifyRoleLevel(ProfileRelationRole.Admin),
          sortOrder: 2000,
          to: { name: 'GeneralProfileSettings' },
        }),
        () => ({
          id: 'profilePermissions',
          moduleId: PROFILES_MODULE_ID,
          text: 'profiles.settings.permissions.label',
          condition: useProfileStore().verifyRoleLevel(ProfileRelationRole.Admin),
          sortOrder: 3000,
          to: { name: 'ProfilePermissionsSettings' },
        }),
        () => ({
          id: 'profileFeatureSettings',
          moduleId: PROFILES_MODULE_ID,
          text: 'profiles.settings.features.label',
          condition: useProfileStore().verifyRoleLevel(ProfileRelationRole.Admin),
          sortOrder: 4000,
          to: { name: 'ProfileFeaturesSettings' },
        }),
        () => ({
          id: 'profilePreferences',
          moduleId: PROFILES_MODULE_ID,
          text: 'profiles.settings.preferences.label',
          condition: useProfileStore().verifyRoleLevel(ProfileRelationRole.Admin),
          sortOrder: 5000,
          to: { name: 'ProfilePreferences' },
        }),
      ]);
    },
  } as IModule;
};
