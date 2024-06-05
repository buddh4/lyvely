import { translation, profilePath } from '@lyvely/web';
import { JournalsFeature } from '@lyvely/journals-interface';
import { ROUTE_JOURNALS_HOME_NAME } from '@/journals.constants';

export default [
  {
    path: profilePath('/journals'),
    name: ROUTE_JOURNALS_HOME_NAME,
    meta: {
      i18n: { load: ['journals', 'calendar-plan'] },
      layout: 'profile',
      feature: JournalsFeature.id,
      title: translation('journals.title'),
    },
    component: () => import('../views/JournalsView.vue'),
  },
];
