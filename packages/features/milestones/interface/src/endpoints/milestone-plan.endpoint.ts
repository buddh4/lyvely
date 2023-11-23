import { Endpoint } from '@lyvely/common';
import { MilestoneModel } from '../models';
import { ICalendarPlanClient } from '@lyvely/calendar-plan-interface';

export interface IMilestonePlanClient extends ICalendarPlanClient<MilestoneModel> {}

export type MilestonePlanEndpoint = Endpoint<IMilestonePlanClient>;
export const ENDPOINT_MILESTONE_PLAN = 'milestone-plan';

export const MilestonePlanEndpointPaths = {
  SORT: (cid: string) => `${cid}/sort`,
};
