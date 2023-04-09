import {
  useSingleton,
  CalendarPlanFilter,
  ICalendarPlanResponse,
  CalendarPlanSort,
  SortResponse,
  IMilestonesEndpointService,
  UpdateMilestoneResponse,
  MilestoneModel,
  CreateMilestoneModel,
  UpdateMilestoneModel,
} from '@lyvely/common';

import repository from '../repositories/milestones.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

export class MilestonesService implements IMilestonesEndpointService {
  async getByFilter(filter: CalendarPlanFilter): Promise<ICalendarPlanResponse<MilestoneModel>> {
    const { models } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((milestone) => new MilestoneModel(milestone)),
    };
  }

  sort(cid: string, move: CalendarPlanSort): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }

  async create(dto: CreateMilestoneModel): Promise<UpdateMilestoneResponse> {
    return unwrapAndTransformResponse(repository.create(dto), UpdateMilestoneResponse);
  }

  update(id: string, update: UpdateMilestoneModel): Promise<UpdateMilestoneResponse> {
    return unwrapAndTransformResponse(repository.update(id, update), UpdateMilestoneResponse);
  }
}

export const useMilestonesService = useSingleton(() => new MilestonesService());
