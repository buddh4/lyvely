import {
  IModule,
  translation,
  registerContentType,
  registerMenuEntries,
  MENU_PROFILE_DRAWER,
} from '@lyvely/web';
import {
  JournalModel,
  CreateJournalModel,
  JournalsFeature,
  JOURNALS_MODULE_ID,
} from '@lyvely/journals-interface';
import { journalRoutes } from './routes';

export default () => {
  return {
    id: JOURNALS_MODULE_ID,
    features: [JournalsFeature],
    routes: journalRoutes,
    init: () => {
      registerMenuEntries(MENU_PROFILE_DRAWER, [
        {
          id: 'journals',
          moduleId: JOURNALS_MODULE_ID,
          title: 'journals.profile_drawer.title',
          feature: JournalsFeature.id,
          icon: 'journal',
          to: { name: 'Journals' },
        },
      ]);
      registerContentType({
        type: JournalModel.contentType,
        modelClass: JournalModel,
        moduleId: JOURNALS_MODULE_ID,
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
