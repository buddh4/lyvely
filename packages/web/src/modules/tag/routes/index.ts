import ProfileTagView from "@/modules/tag/views/ProfileTagView.vue";
import { ifAuthenticated, loadProfile } from "@/router/utils";

export default [
  {
    path: "/tags",
    name: "Tags",
    component: ProfileTagView,
    beforeEnter:  [ifAuthenticated, loadProfile],
  },
];
