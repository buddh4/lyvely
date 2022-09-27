import { ifDevelopEnvironment } from '@server/router/utils';
import StyleGuide from '@server/modules/ui/views/StyleGuide.vue';

export default [
  {
    path: "/style",
    name: "StyleGuide",
    component: StyleGuide,
    meta: {
      layout: 'profile'
    },
    beforeEnter: ifDevelopEnvironment
  }
];
