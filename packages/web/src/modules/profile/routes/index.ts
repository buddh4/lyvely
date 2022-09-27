import { ifAuthenticated, ifIsMultiUserProfile, loadProfile, toProfileHome } from "@server/router/utils";
import { usePageStore } from "@server/modules/core/store/page.store";
import { translate } from "@server/i18n";
import { profileRoot, profileRoute } from "@server/modules/profile/routes/profile-route.util";

export default [
  {
    path: profileRoot(),
    name: "ProfileRoot",
    beforeEnter:  [ifAuthenticated, loadProfile, toProfileHome],
  },
  {
    path: profileRoute(),
    name: "ProfileHome",
    meta: {
      layout: 'profile'
    },
    beforeEnter:  [ifAuthenticated, loadProfile, toProfileHome],
  },
  {
    path: profileRoute("/users"),
    name: "ProfileUsers",
    meta: {
      layout: 'profile'
    },
    component: () => import('../views/users/ProfileUsers.vue'),
    beforeEnter:  [ifAuthenticated, loadProfile, ifIsMultiUserProfile],
  },
  {
    path: profileRoute("/settings"),
    name: "ProfileSettings",
    meta: {
      layout: 'profile'
    },
    redirect: { name: 'UserProfileSettings' },
    component: () => import('../views/settings/ProfileSettings.vue'),
    beforeEnter:  [ifAuthenticated, loadProfile],
    children: [
      {
        name: "UserProfileSettings",
        path: profileRoute("/settings/user"),
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('profile.settings.user.title'))],
        component: () => import('../views/settings/UserProfileSettings.vue')
      },
      {
        name: "GeneralProfileSettings",
        path: profileRoute("/settings/general"),
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('profile.settings.general.title'))],
        component: () => import('../views/settings/GeneralProfileSettings.vue')
      }
    ]
  },
];
