import { ifAuthenticated, loadProfile } from '@/router/utils';
import TaskView from "@/modules/activity/views/TasksView.vue";
import HabitView from "@/modules/activity/views/HabitView.vue";
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
        component: HabitView
      },
      {
        name: "Tasks",
        path: "/activities/tasks",
        beforeEnter:  [ifAuthenticated, loadProfile, () => usePageStore().setTitle(translate('activities.tasks.title'))],
        component: TaskView
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
