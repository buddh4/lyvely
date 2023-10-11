import { translation } from '@/i18n';
import { IModule } from '@/core';
import { registerContentType } from '@/content-stream';
import { JournalModel, CreateJournalModel } from '@lyvely/journals-interface';

export default () => {
  return {
    getId: () => 'journals',
    init: () => {
      registerContentType({
        type: JournalModel.contentType,
        modelClass: JournalModel,
        name: translation('journals.name'),
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
