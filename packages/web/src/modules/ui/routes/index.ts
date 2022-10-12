import { ifDevelopEnvironment } from "@/modules/core";
import StyleGuide from "@/modules/ui/views/StyleGuide.vue";

export default [
  {
    path: "/style",
    name: "StyleGuide",
    component: StyleGuide,
    beforeEnter: ifDevelopEnvironment,
  },
];
