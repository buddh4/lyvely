import { ifDevelopEnvironment } from '@/core';
import StyleGuide from '@/ui/views/StyleGuide.vue';

export const uiRoutes = [
  {
    path: '/style',
    name: 'StyleGuide',
    component: StyleGuide,
    beforeEnter: ifDevelopEnvironment,
  },
];
