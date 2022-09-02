import { ifAuthenticated, loadProfile } from "@/router/utils";
import { usePageStore } from "@/modules/core/store/page.store";
import { translate } from "@/i18n";

export default [
  {
    path: "/tags",
    name: "Tags",
    meta: {
      layout: 'profile'
    },
    component: () => import('../views/ProfileTagsView.vue'),
    beforeEnter: [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('tags.title'))]
  },
];
