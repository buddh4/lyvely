import {
  useSingleton,
  CalendarPlanFilter,
  CalendarPlanSort,
  SortResponse,
  IMilestonePlanEndpointService,
  MilestoneSearchResponse,
} from '@lyvely/common';

import repository from '../repositories/milestone-plan.repository';
import { unwrapAndTransformResponse } from '@/modules/core';

export class MilestonePlanService implements IMilestonePlanEndpointService {
  async getByFilter(filter: CalendarPlanFilter): Promise<MilestoneSearchResponse> {
    return unwrapAndTransformResponse(repository.getByFilter(filter), MilestoneSearchResponse);
  }

  sort(cid: string, move: CalendarPlanSort): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }
}

export const useMilestonePlanService = useSingleton(() => new MilestonePlanService());
