import { translation, profilePath } from '@lyvely/web';
import { JournalsFeature } from '@lyvely/journals-interface';

export default [
  {
    path: profilePath('/journals'),
    name: 'Journals',
    meta: {
      i18n: { load: ['journals', 'calendar-plan'] },
      layout: 'profile',
      feature: JournalsFeature.id,
      title: translation('journals.title'),
    },
    component: () => import('../views/JournalsView.vue'),
  },
];
