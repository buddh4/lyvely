import {
  DataPointIntervalFilter,
  ICalendarPlanResponse,
  IJournalsEndpointService,
  JournalModel,
  SortAction,
  SortResponse,
  useSingleton,
  useDataPointStrategyFacade,
  UpdateDataPointModel,
  UpdateDataPointResponse,
  CreateJournalModel,
  UpdateJournalModel,
  UpdateJournalResponse,
} from '@lyvely/common';
import repository from '../repositories/journals.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

const dataPointService = useDataPointStrategyFacade();

export class JournalsService implements IJournalsEndpointService {
  create(model: CreateJournalModel): Promise<UpdateJournalResponse> {
    return unwrapAndTransformResponse(repository.create(model), UpdateJournalResponse);
  }

  update(id: string, model: UpdateJournalModel): Promise<UpdateJournalResponse> {
    return unwrapAndTransformResponse(repository.update(id, model), UpdateJournalResponse);
  }

  async getByFilter(filter: DataPointIntervalFilter): Promise<ICalendarPlanResponse<JournalModel>> {
    const { models, dataPoints } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((journal) => new JournalModel(journal)),
      dataPoints: dataPoints.map((dataPoint) => dataPointService.createDataPoint(dataPoint)),
    };
  }

  async updateDataPoint(
    cid: string,
    update: UpdateDataPointModel,
  ): Promise<UpdateDataPointResponse> {
    return unwrapAndTransformResponse(
      repository.updateDataPoint(cid, update),
      UpdateDataPointResponse,
    );
  }

  async sort(cid: string, move: SortAction): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }
}

export const useJournalsService = useSingleton(() => new JournalsService());
