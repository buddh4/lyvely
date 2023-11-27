import { Endpoint, IContentTypeClient, profileApiPrefix } from '@lyvely/interface';
import {
  MilestoneModel,
  UpdateMilestoneModel,
  CreateMilestoneModel,
  MilestoneListResponse,
} from '../models';

export interface IMilestonesClient
  extends IContentTypeClient<MilestoneModel, CreateMilestoneModel, UpdateMilestoneModel> {
  getById(mid: string): Promise<MilestoneModel>;
  getAll(): Promise<MilestoneListResponse>;
}

export type MilestonesEndpoint = Endpoint<IMilestonesClient>;
export const ENDPOINT_MILESTONES = profileApiPrefix('milestones');
