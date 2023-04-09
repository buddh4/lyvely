import { defineStore } from 'pinia';
import { MilestoneModel, MilestoneFilter, CalendarPlanStore } from '@lyvely/common';
import { useCalendarPlan } from '@/modules/calendar-plan';
import { useMilestonesService } from '../services/milestones.service';

export const useMilestoneCalendarPlanStore = defineStore('milestone-calendar-plan', () => {
  return useCalendarPlan<MilestoneModel, MilestoneFilter>({
    filter: new MilestoneFilter(),
    cache: new CalendarPlanStore<MilestoneModel>(),
    contentTypes: [MilestoneModel.contentType],
    service: useMilestonesService(),
  });
});
