import {
  useSingleton,
  IMilestonesEndpointService,
  UpdateMilestoneResponse,
  CreateMilestoneModel,
  UpdateMilestoneModel,
  MilestoneModel,
  MilestoneListResponse,
} from '@lyvely/common';

import repository from '../repositories/milestones.repository';
import { unwrapAndTransformResponse } from '@/modules/core';

export class MilestoneService implements IMilestonesEndpointService {
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

export const useMilestonesService = useSingleton(() => new MilestoneService());
