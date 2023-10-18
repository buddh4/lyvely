import { translation, profileRoute } from '@lyvely/web';

export default [
  {
    path: profileRoute('/journals'),
    name: 'Journals',
    meta: {
      i18n: { load: ['journals'] },
      layout: 'profile',
      title: translation('journals.title'),
    },
    component: () => import('../views/Journals.vue'),
  },
];
