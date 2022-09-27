import { ifAuthenticated, loadProfile } from "@server/router/utils";
import Statistics from "@server/modules/statistics/views/StatisticsView.vue";
import { usePageStore } from "@server/modules/core/store/page.store";
import { translate } from "@server/i18n";

export default [
  {
    path: "/statistics",
    name: "Statistics",
    component: Statistics,
    beforeEnter: [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('statistics.title'))]
  }
];
