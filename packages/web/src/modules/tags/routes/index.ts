import { translation } from "@/i18n";
import { profileRoute } from "@/modules/profiles/routes/profile-route.util";

export default [
  {
    path: profileRoute("/tags"),
    name: "Tags",
    meta: {
      layout: "profile",
      title: translation("tags.title"),
    },
    component: () => import("../views/ProfileTagsView.vue"),
  },
];
