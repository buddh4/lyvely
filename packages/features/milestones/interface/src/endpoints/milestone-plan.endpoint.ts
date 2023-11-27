import { Endpoint, profileApiPrefix } from '@lyvely/interface';
import { MilestoneModel } from '../models';
import { ICalendarPlanClient } from '@lyvely/calendar-plan-interface';

export interface IMilestonePlanClient extends ICalendarPlanClient<MilestoneModel> {}

export type MilestonePlanEndpoint = Endpoint<IMilestonePlanClient>;
export const ENDPOINT_MILESTONE_PLAN = profileApiPrefix('milestone-plan');

export const MilestonePlanEndpointPaths = {
  SORT: (cid: string) => `${cid}/sort`,
};
