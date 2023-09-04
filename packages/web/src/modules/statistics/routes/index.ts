import Statistics from '@/modules/statistics/views/StatisticsView.vue';
import { translation } from '@lyvely/i18n';
import { loadProfile } from '@/modules/profiles';

export default [
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: {
      title: translation('statistics.title'),
      layout: 'profile-xl',
    },
    beforeEnter: [loadProfile],
  },
];
