import { defineStore } from 'pinia';
import {
  MilestoneModel,
  MilestoneFilter,
  MilestoneRelationsStore,
  MilestoneSearchResponse,
  useMilestonePlanClient,
} from '@lyvely/milestones-interface';
import { useCalendarPlan } from '@lyvely/calendar-plan-web';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'mitt';

export const useMilestoneCalendarPlanStore = defineStore('milestone-calendar-plan', () => {
  return useCalendarPlan<
    MilestoneModel,
    MilestoneFilter,
    MilestoneSearchResponse,
    MilestoneRelationsStore
  >({
    filter: new MilestoneFilter(),
    cache: new MilestoneRelationsStore(),
    contentTypes: [MilestoneModel.contentType],
    client: useMilestonePlanClient(),
  });
});
