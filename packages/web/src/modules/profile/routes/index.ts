import { ifAuthenticated, loadProfile, toProfileHome } from "@/router/utils";
import { usePageStore } from "@/modules/core/store/page.store";
import { translate } from "@/i18n";
import { profileRoot, profileRoute } from "@/modules/profile/routes/profile-route.util";

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
    path: "/settings",
    name: "ProfileSettings",
    meta: {
      layout: 'profile'
    },
    redirect: { name: 'UserProfileSettings' },
    component: () => import('../views/ProfileSettingsView.vue'),
    beforeEnter:  [ifAuthenticated, loadProfile],
    children: [
      {
        name: "UserProfileSettings",
        path: "/settings/user",
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('profile.settings.user.title'))],
        component: () => import('../views/UserProfileSettingsView.vue')
      },
      {
        name: "GeneralProfileSettings",
        path: "/settings/general",
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('profile.settings.general.title'))],
        component: () => import('../views/GeneralProfileSettingsView.vue')
      }
    ]
  },
];
