import { ifAuthenticated, loadProfile } from "@/router/utils";
import { usePageStore } from "@/modules/core/store/page.store";
import { translate } from "@/i18n";

export default [
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
