import {
  CalendarPlanFilter,
  IJournalsEndpointService,
  JournalModel,
  CalendarPlanSort,
  SortResponse,
  useSingleton,
  useDataPointStrategyFacade,
  UpdateDataPointModel,
  CreateJournalModel,
  UpdateJournalModel,
  UpdateJournalResponse,
  UpdateJournalDataPointResponse,
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

  async getByFilter(filter: CalendarPlanFilter) {
    const { models, dataPoints } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((journal) => new JournalModel(journal)),
      dataPoints: dataPoints.map((dataPoint) => dataPointService.createDataPoint(dataPoint)),
    };
  }

  async updateDataPoint(
    cid: string,
    update: UpdateDataPointModel,
  ): Promise<UpdateJournalDataPointResponse> {
    return unwrapAndTransformResponse(
      repository.updateDataPoint(cid, update),
      UpdateJournalDataPointResponse,
    );
  }

  async sort(cid: string, sort: CalendarPlanSort): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, sort), SortResponse);
  }
}

export const useJournalsService = useSingleton(() => new JournalsService());
