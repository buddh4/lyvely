import { ifIsMultiUserProfile, toProfileHome } from '../guards';
import { translation } from '@/i18n';
import { profilePath, profileRoot } from './profile-route.helper';
import { RouteRecordRaw } from 'vue-router';
import { LAYOUT_PROFILE, LAYOUT_PROFILE_SETTINGS } from '@/profiles/profile.constants';
import { ProfileRelationRole, PROFILES_MODULE_ID, ProfileVisibilityLevel } from '@lyvely/interface';

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
      i18n: {
        load: [{ module: PROFILES_MODULE_ID, section: 'settings' }],
      },
    },
    redirect: { name: 'ProfileMembershipSettings' },
    children: [
      {
        name: 'ProfileMembershipSettings',
        path: profilePath('membership'),
        meta: {
          title: translation('profiles.settings.membership.title'),
          role: ProfileRelationRole.Member,
        },
        component: () => import('../views/ProfileMembershipSettings.vue'),
      },
      {
        path: profilePath('/settings/features'),
        name: 'ProfileFeaturesSettings',
        meta: {
          title: translation('features.settings.features.title'),
          role: ProfileRelationRole.Admin,
        },
        component: () => import('../views/ProfileFeaturesSettings.vue'),
      },
      {
        path: profilePath('/settings/permissions'),
        name: 'ProfilePermissionsSettings',
        meta: {
          title: translation('profiles.settings.permissions.title'),
          role: ProfileRelationRole.Admin,
        },
        component: () => import('../views/ProfilePermissionSettings.vue'),
      },
      {
        name: 'GeneralProfileSettings',
        path: profilePath('general'),
        meta: {
          title: translation('profiles.settings.general.title'),
          role: ProfileRelationRole.Admin,
        },
        component: () => import('../views/GeneralProfileSettings.vue'),
      },
      {
        name: 'ProfilePreferences',
        path: profilePath('preferences'),
        meta: {
          title: translation('profiles.settings.preferences.title'),
          role: ProfileRelationRole.Admin,
          i18n: {
            load: [
              { module: PROFILES_MODULE_ID, section: 'settings' },
              { module: PROFILES_MODULE_ID, section: 'i18n' },
            ],
          },
        },
        component: () => import('../views/ProfilePreferences.vue'),
      },
    ],
  },
] as Array<RouteRecordRaw>;
