import { CalendarPlanService } from '@/modules/calendar';
import {
  CalendarIntervalEnum,
  DataPointIntervalFilter,
  DataPointModel,
  JournalModel,
  SortResult,
  useSingleton,
} from '@lyvely/common';

export class JournalsService implements CalendarPlanService<JournalModel> {
  getByRange(
    filter: DataPointIntervalFilter,
  ): Promise<{ models: JournalModel[]; dataPoints: DataPointModel[] }> {
    return Promise.resolve({ dataPoints: [], models: [] });
  }

  sort(cid: string, interval: CalendarIntervalEnum, attachToId?: string): Promise<SortResult[]> {
    return Promise.resolve([]);
  }
}

export const useJournalsService = useSingleton(() => new JournalsService());
