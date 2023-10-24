import Statistics from '@/statistics/views/StatisticsView.vue';
import { translation } from '@/i18n';
import { loadProfile } from '@/profiles';

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
