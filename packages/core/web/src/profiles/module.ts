import { registerAfterNavigationHooks, registerGuards } from '@/lyvely.router';
import routes from './routes/profile.routes';
import { loadProfileGuard, setProfilePageTitleGuard } from './guards';
import { registerMenuEntries, registerComponentStackEntries, registerLayouts } from '@lyvely/ui';
import {
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_SETTINGS,
  LAYOUT_PROFILE,
  LAYOUT_PROFILE_FULL,
  LAYOUT_PROFILE_XL,
  LAYOUT_PROFILE_SETTINGS,
  STACK_PROFILE_LAYOUT,
} from '@/profiles/profile.constants';
import { isMultiUserProfile, PROFILES_MODULE_ID } from '@lyvely/core-interface';
import { useProfileStore } from '@/profiles/stores';
import { IModule } from '@/core';
import { computed } from 'vue';

export default () => {
  return {
    id: PROFILES_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      features: (locale: string) => import(`./locales/features.${locale}.json`),
      'general-settings': (locale: string) => import(`./locales/general-settings.${locale}.json`),
    },
    routes,
    init: () => {
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
        {
          id: 'profileUsers',
          moduleId: PROFILES_MODULE_ID,
          to: { name: 'ProfileUsers' },
          icon: 'users',
          sortOrder: 3000,
          text: 'profiles.users.label',
          condition: computed(() => {
            const { profile } = useProfileStore();
            return !!profile && isMultiUserProfile(profile);
          }),
        },
        {
          id: 'profileSettings',
          moduleId: PROFILES_MODULE_ID,
          to: { name: 'ProfileSettings' },
          icon: 'settings',
          sortOrder: 4000,
          text: 'profiles.settings.label',
        },
      ]);

      // TODO: Permissions
      registerMenuEntries(MENU_PROFILE_SETTINGS, [
        {
          id: 'ProfileMembership',
          moduleId: PROFILES_MODULE_ID,
          text: 'profiles.settings.membership.label',
          sortOrder: 1000,
          to: { name: 'ProfileMembershipSettings' },
        },
        {
          id: 'GeneralProfileSettings',
          moduleId: PROFILES_MODULE_ID,
          text: 'profiles.settings.general.label',
          sortOrder: 2000,
          to: { name: 'GeneralProfileSettings' },
        },
        {
          id: 'ProfileFeatureSettings',
          moduleId: PROFILES_MODULE_ID,
          text: 'profiles.settings.features.label',
          sortOrder: 3000,
          to: { name: 'ProfileFeaturesSettings' },
        },
      ]);
    },
  } as IModule;
};
