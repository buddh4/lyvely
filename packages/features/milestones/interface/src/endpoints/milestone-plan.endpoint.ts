import { Endpoint } from '@lyvely/common';
import { MilestoneModel } from '../models';
import { ICalendarPlanService } from '@lyvely/calendar-plan-interface';

export interface IMilestonePlanEndpointService extends ICalendarPlanService<MilestoneModel> {}

export type MilestonePlanEndpoint = Endpoint<IMilestonePlanEndpointService>;
export const ENDPOINT_MILESTONE_PLAN = 'milestone-plan';
