import { ifDevelopEnvironment } from '@/router/utils';
import StyleGuide from '@/modules/ui/views/StyleGuide.vue';

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
