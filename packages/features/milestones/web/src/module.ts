import {
  IModule,
  translation,
  registerContentType,
  STACK_CONTENT_DETAILS_HEAD_ADDITION,
  IContentDetailsHeadAdditionStackSpec,
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
  useProfileFeatureStore,
} from '@lyvely/web';
import { registerComponentStackEntry, registerMenuEntry } from '@lyvely/ui';
import {
  MilestoneModel,
  CreateMilestoneModel,
  MILESTONES_MODULE_ID,
  ActivityMilestonesFeature,
  MilestonesFeature,
} from '@lyvely/milestones-interface';
import { milestoneRoutes } from '@/routes';
import { calendarPlanModule } from '@lyvely/calendar-plan-web';
import { ROUTE_MILESTONES_HOME } from '@/milestones.constants';

export default () => {
  return {
    id: 'milestones',
    icon: 'target',
    features: [MilestonesFeature, ActivityMilestonesFeature],
    routes: milestoneRoutes,
    dependencies: [calendarPlanModule()],
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
    init: () => {
      registerMenuEntry(MENU_PROFILE_DRAWER, () => ({
        id: 'profile-milestones',
        moduleId: MILESTONES_MODULE_ID,
        text: 'milestones.title',
        sortOrder: 1530,
        feature: MilestonesFeature.id,
        icon: 'target',
        condition: !useProfileFeatureStore().isFeatureEnabled(ActivityMilestonesFeature.id),
        to: { name: 'Milestones' },
      }));

      registerMenuEntry(MENU_PROFILE_MOBILE_FOOTER, () => ({
        id: 'profile-milestones-footer',
        moduleId: MILESTONES_MODULE_ID,
        text: 'milestones.title',
        sortOrder: 1530,
        feature: MilestonesFeature.id,
        icon: 'target',
        condition: !useProfileFeatureStore().isFeatureEnabled(ActivityMilestonesFeature.id),
        to: { name: 'Milestones' },
      }));

      registerContentType({
        type: MilestoneModel.contentType,
        name: translation('milestones.name'),
        moduleId: MILESTONES_MODULE_ID,
        feature: MilestonesFeature.id,
        modelClass: MilestoneModel,
        route: ROUTE_MILESTONES_HOME,
        interfaces: {
          upsert: {
            createModel: CreateMilestoneModel,
            component: () => import('./components/modals/EditMilestoneModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/MilestoneDetails.vue'),
          },
        },
      });

      registerComponentStackEntry<IContentDetailsHeadAdditionStackSpec>(
        STACK_CONTENT_DETAILS_HEAD_ADDITION,
        {
          id: 'milestone-chooser',
          component: () => import('./components/menus/MilestoneDropdown.vue'),
          sortOrder: 100,
        }
      );
    },
  } as IModule;
};
