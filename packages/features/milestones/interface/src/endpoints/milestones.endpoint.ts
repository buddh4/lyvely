import { Endpoint } from '@lyvely/common';
import {
  MilestoneModel,
  UpdateMilestoneModel,
  CreateMilestoneModel,
  MilestoneListResponse,
} from '../models';
import { IContentTypeService } from '@lyvely/core-interface';

export interface IMilestonesEndpointService
  extends IContentTypeService<MilestoneModel, CreateMilestoneModel, UpdateMilestoneModel> {
  getById(mid: string): Promise<MilestoneModel>;
  getAll(): Promise<MilestoneListResponse>;
}

export type MilestonesEndpoint = Endpoint<IMilestonesEndpointService>;
export const ENDPOINT_MILESTONES = 'milestones';
