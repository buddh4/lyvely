import { toProfileHome, ifIsMultiUserProfile } from '../guards';
import { translation } from '@/i18n';
import { profileIdRoute, profileRoot, profileRoute, profilePath } from './profile-route.util';
import { RouteRecordRaw } from 'vue-router';
import { LAYOUT_PROFILE, LAYOUT_PROFILE_SETTINGS } from '@/profiles';
import { PROFILES_MODULE_ID } from '@lyvely/core-interface';

export default [
  { path: '/', redirect: profileRoute() },
  {
    path: '/pid/:pid/:view?',
    name: 'PID',
  },
  {
    path: profileRoot(),
    name: 'ProfileRoot',
    meta: {
      layout: 'profile',
    },
    beforeEnter: [toProfileHome],
  },
  {
    path: profilePath(),
    name: 'ProfileHome',
    meta: {
      layout: LAYOUT_PROFILE,
    },
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
        path: profilePath('/settings/membership'),
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
        path: profilePath('/settings/general'),
        meta: {
          title: translation('profiles.settings.general.title'),
          i18n: {
            load: [{ module: PROFILES_MODULE_ID, section: 'general-settings' }],
          },
        },
        component: () => import('../views/GeneralProfileSettings.vue'),
      },
    ],
  },
] as Array<RouteRecordRaw>;
