import { ifAuthenticated, loadProfile } from '@/router/utils';
import TaskPlanView from "@/modules/activity/views/TaskPlanView.vue";
import HabitPlanView from "@/modules/activity/views/HabitPlanView.vue";
import ActivityView from "@/modules/activity/views/ActivityView.vue";
import { usePageStore } from "@/modules/core/store/page.store";
import { translate } from "@/i18n";

export default [
  {
    name: 'Activities',
    path: "/activities",
    component: ActivityView,
    redirect: { name: 'Habits' },
    beforeEnter:  [ifAuthenticated, loadProfile],
    children: [
      {
        name: "Habits",
        path: "/activities/habits",
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('activities.habits.title'))],
        component: HabitPlanView
      },
      {
        name: "Tasks",
        path: "/activities/tasks",
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('activities.tasks.title'))],
        component: TaskPlanView
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
