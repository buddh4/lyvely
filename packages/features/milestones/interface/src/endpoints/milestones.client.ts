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
import { IProfileApiRequestOptions, unwrapAndTransformResponse } from '@lyvely/interface';

export class MilestonesClient implements IMilestonesClient {
  async getAll(options?: IProfileApiRequestOptions): Promise<MilestoneListResponse> {
    return unwrapAndTransformResponse(repository.getAll(options), MilestoneListResponse);
  }

  async getById(mid: string, options?: IProfileApiRequestOptions): Promise<MilestoneModel> {
    return unwrapAndTransformResponse(repository.getById(mid, options), MilestoneModel);
  }

  async create(
    dto: CreateMilestoneModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateMilestoneResponse> {
    return unwrapAndTransformResponse(repository.create(dto, options), UpdateMilestoneResponse);
  }

  async update(
    id: string,
    update: UpdateMilestoneModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateMilestoneResponse> {
    return unwrapAndTransformResponse(
      repository.update(id, update, options),
      UpdateMilestoneResponse,
    );
  }
}

export const useMilestonesClient = useSingleton(() => new MilestonesClient());
