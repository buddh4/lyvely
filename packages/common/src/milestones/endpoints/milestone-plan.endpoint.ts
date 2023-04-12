import { Endpoint } from '@/endpoints';
import { MilestoneModel } from '../models';
import { ICalendarPlanService } from '@/calendar-plan';

export interface IMilestonePlanEndpointService extends ICalendarPlanService<MilestoneModel> {}

export type MilestonePlanEndpoint = Endpoint<IMilestonePlanEndpointService>;
export const ENDPOINT_MILESTONE_PLAN = 'milestone-plan';
