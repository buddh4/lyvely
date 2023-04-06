import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { registerContentType } from '@/modules/content-stream';
import { translation } from '@/i18n';
import { JournalModel, CreateJournalModel } from '@lyvely/common';

export default () => {
  return {
    getId: () => 'journals',
    init: () => {
      registerContentType({
        type: JournalModel.contentType,
        modelClass: JournalModel,
        name: translation('journals.content.name'),
        icon: 'journal',
        feature: 'journals',
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreateJournalModel,
            component: () => import('./components/modals/EditJournalModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/modals/EditJournalModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/JournalDetails.vue'),
            entry: () => import('./components/content-stream/JournalStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
