import {
  IMilestonePlanEndpointService,
  MilestoneSearchResponse,
} from '@lyvely/milestones-interface';
import { SortResponse, useSingleton } from '@lyvely/common';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-interface';

import repository from '../repositories/milestone-plan.repository';
import { unwrapAndTransformResponse } from '@lyvely/web';

export class MilestonePlanService implements IMilestonePlanEndpointService {
  async getByFilter(filter: CalendarPlanFilter): Promise<MilestoneSearchResponse> {
    return unwrapAndTransformResponse(repository.getByFilter(filter), MilestoneSearchResponse);
  }

  sort(cid: string, move: CalendarPlanSort): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }
}

export const useMilestonePlanService = useSingleton(() => new MilestonePlanService());
