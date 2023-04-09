import { Endpoint } from '@/endpoints';
import { MilestoneModel, UpdateMilestoneModel, CreateMilestoneModel } from '../models';
import { IContentTypeService } from '@/content';
import { ICalendarPlanService } from '@/calendar-plan';

export interface IMilestonesEndpointService
  extends IContentTypeService<MilestoneModel, CreateMilestoneModel, UpdateMilestoneModel>,
    ICalendarPlanService<MilestoneModel> {}

export type MilestoneEndpoint = Endpoint<IMilestonesEndpointService>;
export const ENDPOINT_MILESTONES = 'milestones';
