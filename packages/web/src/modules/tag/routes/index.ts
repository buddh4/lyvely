import { ifAuthenticated, loadProfile } from "@server/router/utils";
import { usePageStore } from "@server/modules/core/store/page.store";
import { translate } from "@server/i18n";
import { profileRoute } from "@server/modules/profile/routes/profile-route.util";

export default [
  {
    path: profileRoute('/tags'),
    name: "Tags",
    meta: {
      layout: 'profile'
    },
    component: () => import('../views/ProfileTagsView.vue'),
    beforeEnter: [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('tags.title'))]
  },
];
