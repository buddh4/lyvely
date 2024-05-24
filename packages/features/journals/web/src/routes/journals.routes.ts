import { translation, profilePath } from '@lyvely/web';

export default [
  {
    path: profilePath('/journals'),
    name: 'Journals',
    meta: {
      i18n: { load: ['journals'] },
      layout: 'profile',
      title: translation('journals.title'),
    },
    component: () => import('../views/JournalsView.vue'),
  },
];
