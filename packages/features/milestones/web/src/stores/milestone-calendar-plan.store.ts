import { defineStore } from 'pinia';
import {
  MilestoneModel,
  MilestoneFilter,
  MilestoneRelationsStore,
  MilestoneSearchResponse,
  useMilestonePlanClient,
} from '@lyvely/milestones-interface';
import { useCalendarPlan, useCreateCalendarPlanItem } from '@lyvely/calendar-plan-web';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'mitt';

export const useMilestoneCalendarPlanStore = defineStore('milestone-calendar-plan', () => {
  const calendarPlan = useCalendarPlan<
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

  const { createItem } = useCreateCalendarPlanItem(MilestoneModel.contentType);

  return {
    ...calendarPlan,
    createItem,
  };
});
