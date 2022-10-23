import { toProfileHome } from '@/modules/profiles';
import { translation } from '@/i18n';
import { profileRoot, profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { ifIsMultiUserProfile, loadProfile } from '../guards';

export default [
  {
    path: profileRoot(),
    name: 'ProfileRoot',
    beforeEnter: [loadProfile, toProfileHome],
  },
  {
    path: profileRoute(),
    name: 'ProfileHome',
    meta: {
      layout: 'profile',
    },
    beforeEnter: [loadProfile, toProfileHome],
  },
  {
    path: profileRoute('/users'),
    name: 'ProfileUsers',
    meta: {
      layout: 'profile',
    },
    component: () => import('../views/users/ProfileUsers.vue'),
    beforeEnter: [loadProfile, ifIsMultiUserProfile],
  },
  {
    path: profileRoute('/settings'),
    name: 'ProfileSettings',
    meta: {
      layout: 'profile',
    },
    redirect: { name: 'UserProfileSettings' },
    component: () => import('../views/settings/ProfileSettings.vue'),
    beforeEnter: [loadProfile],
    children: [
      {
        name: 'UserProfileSettings',
        path: profileRoute('/settings/user'),
        meta: {
          title: translation('profile.settings.user.title'),
        },
        beforeEnter: [loadProfile],
        component: () => import('../views/settings/UserProfileSettings.vue'),
      },
      {
        name: 'GeneralProfileSettings',
        path: profileRoute('/settings/general'),
        meta: {
          title: translation('profile.settings.general.title'),
        },
        beforeEnter: [loadProfile],
        component: () => import('../views/settings/GeneralProfileSettings.vue'),
      },
    ],
  },
];
