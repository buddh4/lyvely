import { IMilestonePlanClient } from './milestone-plan.endpoint';
import { MilestoneSearchResponse } from '../models';
import { SortResponse, useSingleton } from '@lyvely/common';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-interface';
import repository from './milestone-plan.repository';
import { unwrapAndTransformResponse } from '@lyvely/interface';

export class MilestonePlanClient implements IMilestonePlanClient {
  async getByFilter(filter: CalendarPlanFilter): Promise<MilestoneSearchResponse> {
    return unwrapAndTransformResponse(repository.getByFilter(filter), MilestoneSearchResponse);
  }

  sort(cid: string, move: CalendarPlanSort): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }
}

export const useMilestonePlanClient = useSingleton(() => new MilestonePlanClient());
