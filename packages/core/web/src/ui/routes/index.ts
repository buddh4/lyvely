import { ifDevelopEnvironment } from '@/core';
import StyleGuide from '@/ui/views/StyleGuide.vue';

export default [
  {
    path: '/style',
    name: 'StyleGuide',
    component: StyleGuide,
    beforeEnter: ifDevelopEnvironment,
  },
];
