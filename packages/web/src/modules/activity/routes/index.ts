import { ifAuthenticated, loadProfile } from '@server/router/utils';
import { usePageStore } from "@server/modules/core/store/page.store";
import { translate } from "@server/i18n";
import { profileRoute } from "@server/modules/profile/routes/profile-route.util";

export default [
  {
    name: 'Activities',
    path: profileRoute('/activities'),
    component: () => import('../views/ActivityLayout.vue'),
    meta: {
      i18n: { module: 'activity' },
      layout: 'profile'
    },
    beforeEnter:  [ifAuthenticated, loadProfile],
    children: [
      {
        name: "Habits",
        path: "",
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('activities.habits.title'))],
        component: () => import('../views/HabitPlanView.vue')
      },
      {
        name: "Tasks",
        path: profileRoute('/activities/tasks'),
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
