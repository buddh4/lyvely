import { IModule, registerContentType, translation } from '@lyvely/web';
import { CreateHabitModel, HabitModel, HABIT_MODULE_ID } from '@lyvely/habits-interface';

export default () => {
  return {
    id: HABIT_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    init: () => {
      registerContentType({
        type: HabitModel.contentType,
        moduleId: HABIT_MODULE_ID,
        name: translation('habits.name'),
        icon: 'activity',
        feature: 'habits',
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
