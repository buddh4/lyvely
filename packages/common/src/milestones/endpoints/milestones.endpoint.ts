import { Endpoint } from '@/endpoints';
import { MilestoneModel, UpdateMilestoneModel, CreateMilestoneModel } from '../models';
import { IContentTypeService } from '@lyvely/content';
import { MilestoneListResponse } from '@/milestones/models/milestone-list.response';

export interface IMilestonesEndpointService
  extends IContentTypeService<MilestoneModel, CreateMilestoneModel, UpdateMilestoneModel> {
  getById(mid: string): Promise<MilestoneModel>;
  getAll(): Promise<MilestoneListResponse>;
}

export type MilestonesEndpoint = Endpoint<IMilestonesEndpointService>;
export const ENDPOINT_MILESTONES = 'milestones';
