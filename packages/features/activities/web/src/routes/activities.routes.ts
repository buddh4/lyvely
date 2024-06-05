import { profilePath, t, useProfileMenu, PATH_404 } from '@lyvely/web';
import { useActivityStore } from '@/stores';
import { RouteRecordRaw } from 'vue-router';
import { LAYOUT_ACTIVITIES, MENU_ACTIVITIES } from '@/activities.constants';

export const activitiesRoutes = [
  {
    name: 'Activities',
    path: profilePath('/activities'),
    redirect: { name: 'ActivitiesRoot' },
    children: [
      {
        name: 'ActivitiesRoot',
        path: '',
        beforeEnter: [
          (to, from, next) => {
            const activitiesMenu = useProfileMenu(MENU_ACTIVITIES);

            if (!activitiesMenu.hasEnabledEntries.value) {
              return PATH_404;
            }

            const activityStore = useActivityStore();

            if (
              activityStore.activeView &&
              ['ActivityHabits', 'ActivityTasks', 'ActivityMilestones'].includes(
                activityStore.activeView
              )
            ) {
              next({ name: activityStore.activeView });
            } else {
              next(activitiesMenu.enabledMenuEntries.value[0].to!);
            }
          },
        ],
      },
      {
        name: 'ActivityHabits',
        path: 'habits',
        meta: {
          layout: LAYOUT_ACTIVITIES,
          i18n: { load: ['activities', 'habits'] },
          title: () => t('habits.title'),
        },
        component: async () => {
          const { ActivityHabitsView } = await import('@lyvely/habits-web');
          return ActivityHabitsView;
        },
        beforeEnter: [
          () => {
            useActivityStore().setActiveView('ActivityHabits');
          },
        ],
      },
      {
        name: 'ActivityTasks',
        path: 'tasks',
        meta: {
          layout: LAYOUT_ACTIVITIES,
          i18n: { load: ['activities', 'tasks'] },
          title: () => t('tasks.title'),
        },
        component: async () => {
          const { ActivityTasksView } = await import('@lyvely/tasks-web');
          return ActivityTasksView;
        },
        beforeEnter: [
          () => {
            useActivityStore().setActiveView('ActivityTasks');
          },
        ],
      },
      {
        name: 'ActivityMilestones',
        path: 'milestones',
        meta: {
          layout: LAYOUT_ACTIVITIES,
          i18n: { load: ['activities', 'milestones'] },
          title: () => t('milestones.title'),
        },
        component: async () => {
          const { ActivityMilestonesView } = await import('@lyvely/milestones-web');
          return ActivityMilestonesView;
        },
        beforeEnter: [
          () => {
            useActivityStore().setActiveView('ActivityMilestones');
          },
        ],
      },
    ],
  },
] as RouteRecordRaw[];

/**

 */
