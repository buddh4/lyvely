import {
  IModule,
  translation,
  registerContentType,
  registerMenuEntries,
  MENU_PROFILE_DRAWER,
  useProfileFeatureStore,
} from '@lyvely/web';
import {
  MilestoneModel,
  CreateMilestoneModel,
  MILESTONES_MODULE_ID,
  ActivityMilestonesFeature,
  MilestonesFeature,
} from '@lyvely/milestones-interface';
import { computed } from 'vue';
import { milestoneRoutes } from '@/routes';

export default () => {
  return {
    id: 'milestones',
    features: [MilestonesFeature, ActivityMilestonesFeature],
    routes: milestoneRoutes,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    init: () => {
      registerMenuEntries(MENU_PROFILE_DRAWER, [
        {
          id: 'profile-milestones',
          moduleId: MILESTONES_MODULE_ID,
          text: 'milestones.title',
          sortOrder: 1503,
          feature: MilestonesFeature.id,
          icon: 'target',
          condition: computed(() => {
            return !useProfileFeatureStore().isFeatureEnabled(ActivityMilestonesFeature.id).value;
          }),
          to: { name: 'Milestones' },
        },
      ]);
      registerContentType({
        type: MilestoneModel.contentType,
        name: translation('milestones.name'),
        icon: 'target',
        moduleId: MILESTONES_MODULE_ID,
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
