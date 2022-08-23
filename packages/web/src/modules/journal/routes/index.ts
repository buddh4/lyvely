import { ifAuthenticated, loadProfile } from "@/router/utils";
import Journal from "@/modules/journal/components/Journal.vue";
import { usePageStore } from "@/modules/core/store/page.store";
import { translate } from "@/i18n";

export default [
  {
    path: "/journal",
    name: "Journal",
    component: Journal,
    beforeEnter: [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('journal.title'))]
  }
];
