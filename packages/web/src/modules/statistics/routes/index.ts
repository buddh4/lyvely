import Statistics from '@/modules/statistics/views/StatisticsView.vue';
import { translation } from '@/i18n';
import { loadProfile } from '@/modules/profiles';

export default [
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: {
      title: translation('statistics.title'),
      layout: 'profile',
    },
    beforeEnter: [loadProfile],
  },
];
