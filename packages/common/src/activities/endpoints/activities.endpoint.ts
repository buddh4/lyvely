import { ICalendarPlanService } from '@/calendar-plan';
import { ActivityModel } from '@/activities';
import { Endpoint } from '@/endpoints';

export interface IActivityEndpointService extends ICalendarPlanService<ActivityModel> {}
export type ActivityEndpoint = Endpoint<IActivityEndpointService>;
export const ENDPOINT_ACTIVITIES = 'activities';