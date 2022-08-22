import { ifAuthenticated, loadProfile } from '@/router/utils';
import TaskView from "@/modules/activity/views/TasksView.vue";
import HabitView from "@/modules/activity/views/HabitView.vue";
import ActivityView from "@/modules/activity/views/ActivityView.vue";

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
        beforeEnter:  [ifAuthenticated, loadProfile],
        component: HabitView
      },
      {
        name: "Tasks",
        path: "/activities/tasks",
        beforeEnter:  [ifAuthenticated, loadProfile],
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
