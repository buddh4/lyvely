import { ifAuthenticated, loadProfile } from '@/router/utils';
import { usePageStore } from "@/modules/core/store/page.store";
import { translate } from "@/i18n";

export default [
  {
    name: 'Activities',
    path: "/activities",
    component: () => import('../views/ActivityView.vue'),
    meta: {
      i18n: { module: 'activity' }
    },
    redirect: { name: 'Habits' },
    beforeEnter:  [ifAuthenticated, loadProfile],
    children: [
      {
        name: "Habits",
        path: "/activities/habits",
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('activities.habits.title'))],
        component: () => import('../views/HabitPlanView.vue')
      },
      {
        name: "Tasks",
        path: "/activities/tasks",
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('activities.tasks.title'))],
        component: () => import('../views/TaskPlanView.vue')
      },
      /*{
        name: "Goals",
        path: "/activities/goals",
        beforeEnter:  [ifAuthenticated, loadProfile],
        component: GoalsView
      }*/
    ]
  }
];
