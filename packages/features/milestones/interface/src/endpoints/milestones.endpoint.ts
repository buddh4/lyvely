import { Endpoint } from '@lyvely/common';
import {
  MilestoneModel,
  UpdateMilestoneModel,
  CreateMilestoneModel,
  MilestoneListResponse,
} from '../models';
import { IContentTypeClient } from '@lyvely/interface';

export interface IMilestonesEndpointService
  extends IContentTypeClient<MilestoneModel, CreateMilestoneModel, UpdateMilestoneModel> {
  getById(mid: string): Promise<MilestoneModel>;
  getAll(): Promise<MilestoneListResponse>;
}

export type MilestonesEndpoint = Endpoint<IMilestonesEndpointService>;
export const ENDPOINT_MILESTONES = 'milestones';
