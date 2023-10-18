import { toProfileHome, ifIsMultiUserProfile } from '../guards';
import { translation } from '@/i18n';
import { profileRoot, profileRoute } from './profile-route.util';
import { RouteRecordRaw } from 'vue-router';
import { LAYOUT_PROFILE, LAYOUT_PROFILE_SETTINGS } from '@/profiles';

export default [
  { path: '/', redirect: profileRoute() },
  {
    path: profileRoot(),
    name: 'ProfileRoot',
    meta: {
      layout: 'profile',
    },
    beforeEnter: [toProfileHome],
  },
  {
    path: profileRoute(),
    name: 'ProfileHome',
    meta: {
      layout: LAYOUT_PROFILE,
    },
    beforeEnter: [toProfileHome],
  },
  {
    path: profileRoute('/users'),
    name: 'ProfileUsers',
    meta: {
      layout: LAYOUT_PROFILE,
    },
    component: () => import('../views/ProfileUsers.vue'),
    beforeEnter: [ifIsMultiUserProfile],
  },
  {
    path: profileRoute('/settings'),
    name: 'ProfileSettings',
    meta: {
      layout: LAYOUT_PROFILE_SETTINGS,
    },
    redirect: { name: 'ProfileMembershipSettings' },
    children: [
      {
        name: 'ProfileMembershipSettings',
        path: profileRoute('/settings/membership'),
        meta: {
          title: translation('profile.settings.membership.title'),
        },
        component: () => import('../views/ProfileMembershipSettings.vue'),
      },
      {
        path: profileRoute('/settings/features'),
        name: 'ProfileFeaturesSettings',
        meta: {
          title: translation('features.settings.features.title'),
        },
        component: () => import('../views/ProfileFeaturesSettings.vue'),
      },
      {
        name: 'GeneralProfileSettings',
        path: profileRoute('/settings/general'),
        meta: {
          title: translation('profile.settings.general.title'),
        },
        component: () => import('../views/GeneralProfileSettings.vue'),
      },
    ],
  },
] as Array<RouteRecordRaw>;
