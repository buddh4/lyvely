import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentType } from '@/modules/content-stream';
import { translation } from '@/i18n';
import { MilestoneModel, CreateMilestoneModel } from '@lyvely/milestones-interface';

export default () => {
  return {
    getId: () => 'milestones',
    init: () => {
      registerContentType({
        type: MilestoneModel.contentType,
        name: translation('milestones.name'),
        icon: 'target',
        feature: 'milestones',
        modelClass: MilestoneModel,
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreateMilestoneModel,
            component: () => import('./components/modals/EditMilestoneModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/modals/EditMilestoneModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/MilestoneDetails.vue'),
            entry: () => import('./components/content-stream/MilestoneStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
