import {
  IModule,
  registerContentType,
  registerFeatures,
  registerMenuEntries,
  registerRoutes,
  translation,
} from '@lyvely/web';
import {
  CreateHabitModel,
  HabitModel,
  HABIT_MODULE_ID,
  HabitsFeature,
} from '@lyvely/habits-interface';
import { ACTIVITIES_MENU } from '@lyvely/activities-web';
import { habitRoutes } from '@/routes';

export default () => {
  return {
    id: HABIT_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    init: () => {
      registerRoutes(habitRoutes);
      registerFeatures([HabitsFeature]);
      registerMenuEntries(ACTIVITIES_MENU, [
        {
          id: 'activities-habits',
          text: 'habits.menu.title',
          moduleId: HABIT_MODULE_ID,
          icon: 'activity',
          feature: HabitsFeature.id,
          to: { name: 'Habits' },
        },
      ]);
      registerContentType({
        type: HabitModel.contentType,
        moduleId: HABIT_MODULE_ID,
        name: translation('habits.name'),
        icon: 'activity',
        feature: HabitsFeature.id,
        modelClass: HabitModel,
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreateHabitModel,
            component: () => import('./components/modals/EditHabitModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/modals/EditHabitModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/HabitDetails.vue'),
            entry: () => import('./components/content-stream/HabitStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
