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
  UpdateDataPointModel,
  UpdateDataPointResponse,
} from '@lyvely/common';
import repository from '../repositories/journals.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

const dataPointFactory = useDataPointFactory();

export class JournalsService implements IJournalsEndpointService {
  async getByFilter(
    filter: DataPointIntervalFilter,
  ): Promise<ICalendarPlanResponse<JournalModel, DataPointModel>> {
    const { models, dataPoints } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((journal) => new JournalModel(journal)),
      dataPoints: dataPoints.map((dataPoint) => dataPointFactory.createDataPoint(dataPoint)),
    };
  }

  async updateDataPoint(cid: string, update: UpdateDataPointModel): Promise<UpdateDataPointModel> {
    return unwrapAndTransformResponse(
      repository.updateDataPoint(cid, update),
      UpdateDataPointResponse,
    );
  }

  async sort(cid: string, move: MoveAction): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }
}

export const useJournalsService = useSingleton(() => new JournalsService());
