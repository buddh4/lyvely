import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import { CreateHabitModel, HabitModel } from '@lyvely/habits-interface';
import { translation } from '@/i18n';

export default () => {
  return {
    getId: () => 'habits',
    init: () => {
      registerContentType({
        type: HabitModel.contentType,
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
