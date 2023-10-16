import { translation, profileRoute } from '@lyvely/web';

export default [
  {
    path: profileRoute('/journals'),
    name: 'Journals',
    meta: {
      i18n: { module: 'journals' },
      layout: 'profile',
      title: translation('journals.title'),
    },
    component: () => import('../views/Journals.vue'),
  },
];
