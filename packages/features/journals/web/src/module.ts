import {
  IModule,
  translation,
  registerContentType,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
} from '@lyvely/web';
import { registerMenuEntries } from '@lyvely/ui';
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
          text: 'journals.profile_drawer.title',
          feature: JournalsFeature.id,
          icon: 'journal',
          to: { name: 'Journals' },
        },
      ]);
      registerMenuEntries(MENU_PROFILE_MOBILE_FOOTER, [
        {
          id: 'journals-footer',
          moduleId: JOURNALS_MODULE_ID,
          text: 'journals.profile_drawer.title',
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
