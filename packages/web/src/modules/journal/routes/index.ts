import { ifAuthenticated } from "@/router/utils";
import Journal from "@/modules/journal/components/Journal.vue";

export default [
  {
    path: "/journal",
    name: "Journal",
    component: Journal,
    beforeEnter: ifAuthenticated
  }
];
