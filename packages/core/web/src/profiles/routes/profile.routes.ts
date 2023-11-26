import { toProfileHome, ifIsMultiUserProfile } from '../guards';
import { translation } from '@/i18n';
import { profileRoot, profilePath, profileRoute, profilePathRoute } from './profile-route.helper';
import { RouteRecordRaw } from 'vue-router';
import { LAYOUT_PROFILE, LAYOUT_PROFILE_SETTINGS } from '@/profiles/profile.constants';
import { PROFILES_MODULE_ID } from '@lyvely/interface';

export default [
  {
    path: '/pid/:pid/:view?',
    name: 'PID',
  },
  {
    path: profileRoot(),
    name: 'ProfileRoot',
    beforeEnter: [toProfileHome],
  },
  {
    path: profilePath(),
    name: 'ProfileHome',
    beforeEnter: [toProfileHome],
  },
  {
    path: profilePath('/users'),
    name: 'ProfileUsers',
    meta: {
      layout: LAYOUT_PROFILE,
    },
    component: () => import('../views/ProfileUsers.vue'),
    beforeEnter: [ifIsMultiUserProfile],
  },
  {
    path: profilePath('/settings'),
    name: 'ProfileSettings',
    meta: {
      layout: LAYOUT_PROFILE_SETTINGS,
    },
    redirect: { name: 'ProfileMembershipSettings' },
    children: [
      {
        name: 'ProfileMembershipSettings',
        path: profilePath('membership'),
        meta: {
          title: translation('profiles.settings.membership.title'),
        },
        component: () => import('../views/ProfileMembershipSettings.vue'),
      },
      {
        path: profilePath('/settings/features'),
        name: 'ProfileFeaturesSettings',
        meta: {
          title: translation('features.settings.features.title'),
          i18n: {
            load: [{ module: PROFILES_MODULE_ID, section: 'features' }],
          },
        },
        component: () => import('../views/ProfileFeaturesSettings.vue'),
      },
      {
        name: 'GeneralProfileSettings',
        path: profilePath('general'),
        meta: {
          title: translation('profiles.settings.general.title'),
          i18n: {
            load: [{ module: PROFILES_MODULE_ID, section: 'general-settings' }],
          },
        },
        component: () => import('../views/GeneralProfileSettings.vue'),
      },
      {
        name: 'ProfilePreferences',
        path: profilePath('preferences'),
        meta: {
          title: translation('profiles.settings.preferences.title'),
          i18n: {
            load: [{ module: PROFILES_MODULE_ID, section: 'i18n' }],
          },
        },
        component: () => import('../views/ProfilePreferences.vue'),
      },
    ],
  },
] as Array<RouteRecordRaw>;
