import {
  CreateJournalModel,
  JournalModel,
  UpdateJournalDataPointResponse,
  UpdateJournalModel,
  UpdateJournalResponse,
} from '../models';
import { IJournalsEndpointService } from './journals.endpoint';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { useDataPointStrategyFacade, UpdateDataPointModel } from '@lyvely/time-series-interface';
import { useSingleton } from '@lyvely/common';
import {
  SortResponse,
  IProfileApiRequestOptions,
  unwrapAndTransformResponse,
  unwrapResponse,
} from '@lyvely/interface';
import repository from './journals.repository';

const dataPointService = useDataPointStrategyFacade();

export class JournalsClient implements IJournalsEndpointService {
  create(
    model: CreateJournalModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateJournalResponse> {
    return unwrapAndTransformResponse(repository.create(model, options), UpdateJournalResponse);
  }

  update(
    id: string,
    model: UpdateJournalModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateJournalResponse> {
    return unwrapAndTransformResponse(repository.update(id, model, options), UpdateJournalResponse);
  }

  async getByFilter(filter: CalendarPlanFilter, options?: IProfileApiRequestOptions) {
    const { models, dataPoints } = await unwrapResponse(repository.getByFilter(filter, options));
    return {
      models: models.map((journal) => new JournalModel(journal)),
      dataPoints: dataPoints.map((dataPoint) => dataPointService.createDataPoint(dataPoint)),
    };
  }

  async updateDataPoint(
    cid: string,
    update: UpdateDataPointModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateJournalDataPointResponse> {
    return unwrapAndTransformResponse(
      repository.updateDataPoint(cid, update, options),
      UpdateJournalDataPointResponse,
    );
  }

  async sort(
    cid: string,
    sort: CalendarPlanSort,
    options?: IProfileApiRequestOptions,
  ): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, sort, options), SortResponse);
  }
}

export const useJournalsClient = useSingleton(() => new JournalsClient());
