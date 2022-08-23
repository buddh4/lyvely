import ProfileTagView from "@/modules/tag/views/ProfileTagView.vue";
import { ifAuthenticated, loadProfile } from "@/router/utils";
import { usePageStore } from "@/modules/core/store/page.store";
import { translate } from "@/i18n";

export default [
  {
    path: "/tags",
    name: "Tags",
    component: ProfileTagView,
    beforeEnter: [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('tags.title'))]
  },
];
