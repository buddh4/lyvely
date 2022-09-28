import { ifAuthenticated, loadProfile } from "@/router/utils";
import Statistics from "@/modules/statistics/views/StatisticsView.vue";
import { usePageStore } from "@/modules/core/store/page.store";
import { translate } from "@/i18n";

export default [
  {
    path: "/statistics",
    name: "Statistics",
    component: Statistics,
    beforeEnter: [
      ifAuthenticated,
      loadProfile,
      () => usePageStore().setTitle(translate("statistics.title")),
    ],
  },
];
