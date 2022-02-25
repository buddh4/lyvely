import { ifAuthenticated } from "@/router/utils";
import Statistics from "@/modules/statistics/views/StatisticsView.vue";

export default [
  {
    path: "/statistics",
    name: "Statistics",
    component: Statistics,
    beforeEnter: ifAuthenticated
  }
];
