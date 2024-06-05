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
import { calendarPlanModule } from '@lyvely/calendar-plan-web';
import { timeSeriesModule } from '@lyvely/time-series-web';
import { ROUTE_JOURNALS_HOME } from '@/journals.constants';

export const journalsModule = () => {
  return {
    id: JOURNALS_MODULE_ID,
    features: [JournalsFeature],
    routes: journalRoutes,
    icon: 'journal',
    dependencies: [calendarPlanModule(), timeSeriesModule()],
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
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
        route: ROUTE_JOURNALS_HOME,
        name: translation('journals.name'),
        feature: 'journals',
        interfaces: {
          upsert: {
            createModel: CreateJournalModel,
            component: () => import('./components/modals/UpsertJournalModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/JournalDetails.vue'),
          },
        },
      });
    },
  } as IModule;
};
