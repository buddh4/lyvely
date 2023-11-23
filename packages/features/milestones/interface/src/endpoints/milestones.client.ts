import {
  UpdateMilestoneResponse,
  CreateMilestoneModel,
  UpdateMilestoneModel,
  MilestoneModel,
  MilestoneListResponse,
} from '../models';
import { IMilestonesClient } from './milestones.endpoint';
import { useSingleton } from '@lyvely/common';
import repository from './milestones.repository';
import { unwrapAndTransformResponse } from '@lyvely/interface';

export class MilestonesClient implements IMilestonesClient {
  async getAll(): Promise<MilestoneListResponse> {
    return unwrapAndTransformResponse(repository.getAll(), MilestoneListResponse);
  }

  async getById(mid: string): Promise<MilestoneModel> {
    return unwrapAndTransformResponse(repository.getById(mid), MilestoneModel);
  }

  async create(dto: CreateMilestoneModel): Promise<UpdateMilestoneResponse> {
    return unwrapAndTransformResponse(repository.create(dto), UpdateMilestoneResponse);
  }

  async update(id: string, update: UpdateMilestoneModel): Promise<UpdateMilestoneResponse> {
    return unwrapAndTransformResponse(repository.update(id, update), UpdateMilestoneResponse);
  }
}

export const useMilestonesClient = useSingleton(() => new MilestonesClient());
