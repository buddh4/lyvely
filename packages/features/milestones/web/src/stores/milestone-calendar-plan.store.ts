import { defineStore } from 'pinia';
import {
  MilestoneModel,
  MilestoneFilter,
  MilestoneRelationsStore,
  MilestoneSearchResponse,
} from '@lyvely/milestones-interface';
import { useCalendarPlan } from '@/modules/calendar-plan';
import { useMilestonePlanService } from '../services/milestone-plan-service';

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
    service: useMilestonePlanService(),
  });
});
