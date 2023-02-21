import {
  DataPointIntervalFilter,
  ICalendarPlanResponse,
  IJournalsEndpointService,
  JournalModel,
  MoveAction,
  SortResponse,
  useSingleton,
  useDataPointFactory,
  DataPointModel,
} from '@lyvely/common';
import repository from '../repositories/journals.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

export class JournalsService implements IJournalsEndpointService {
  dataPointFactory = useDataPointFactory();

  async getByFilter(
    filter: DataPointIntervalFilter,
  ): Promise<ICalendarPlanResponse<JournalModel, DataPointModel>> {
    const { models, dataPoints } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((journal) => new JournalModel(journal)),
      dataPoints: dataPoints.map((dataPoint) => this.dataPointFactory.createDataPoint(dataPoint)),
    };
  }

  async sort(cid: string, move: MoveAction): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }
}

export const useJournalsService = useSingleton(() => new JournalsService());
