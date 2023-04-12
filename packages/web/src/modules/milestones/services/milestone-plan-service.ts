import {
  useSingleton,
  CalendarPlanFilter,
  ICalendarPlanResponse,
  CalendarPlanSort,
  SortResponse,
  IMilestonePlanEndpointService,
  MilestoneModel,
} from '@lyvely/common';

import repository from '../repositories/milestone-plan.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

export class MilestonePlanService implements IMilestonePlanEndpointService {
  async getByFilter(filter: CalendarPlanFilter): Promise<ICalendarPlanResponse<MilestoneModel>> {
    const { models } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((milestone) => new MilestoneModel(milestone)),
    };
  }

  sort(cid: string, move: CalendarPlanSort): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }
}

export const useMilestonePlanService = useSingleton(() => new MilestonePlanService());
