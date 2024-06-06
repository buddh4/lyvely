import {
  UpdateHabitModel,
  UpdateHabitDataPointModel,
  CreateHabitModel,
  HabitModel,
  UpdateHabitResponse,
  UpdateHabitDataPointResponse,
  UpdateHabitDataPointTimerResponse,
} from '../models';
import { IHabitsEndpointClient } from './habits.endpoint';
import {
  TimerUpdateModel,
  SortResponse,
  unwrapAndTransformResponse,
  unwrapResponse,
  IProfileApiRequestOptions,
} from '@lyvely/interface';
import { useSingleton } from '@lyvely/common';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { useDataPointStrategyFacade, TimerDataPointModel } from '@lyvely/time-series-interface';
import repository from './habits.repository';

export class HabitsClient implements IHabitsEndpointClient {
  async getByFilter(filter: CalendarPlanFilter, options?: IProfileApiRequestOptions) {
    const { models, dataPoints } = await unwrapResponse(repository.getByFilter(filter, options));
    return {
      models: models.map((habit) => new HabitModel(habit)),
      dataPoints: dataPoints?.map((dataPoint) =>
        useDataPointStrategyFacade().createDataPoint(dataPoint)
      ),
    };
  }

  sort(
    cid: string,
    sort: CalendarPlanSort,
    options?: IProfileApiRequestOptions
  ): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, sort, options), SortResponse);
  }

  async create(
    dto: CreateHabitModel,
    options?: IProfileApiRequestOptions
  ): Promise<UpdateHabitResponse> {
    return unwrapAndTransformResponse(repository.create(dto, options), UpdateHabitResponse);
  }

  async update(
    cid: string,
    update: UpdateHabitModel,
    options?: IProfileApiRequestOptions
  ): Promise<UpdateHabitResponse> {
    return unwrapAndTransformResponse(repository.update(cid, update, options), UpdateHabitResponse);
  }

  async updateDataPoint(
    cid: string,
    update: UpdateHabitDataPointModel,
    options?: IProfileApiRequestOptions
  ): Promise<UpdateHabitDataPointResponse> {
    const result = await unwrapResponse(repository.updateDataPoint(cid, update, options));
    result.dataPoint = useDataPointStrategyFacade().createDataPoint(result.dataPoint);
    result.model = new HabitModel(result.model);
    return result;
  }

  async startTimer(
    cid: string,
    dto: TimerUpdateModel,
    options?: IProfileApiRequestOptions
  ): Promise<TimerDataPointModel> {
    return unwrapAndTransformResponse(
      repository.startTimer(cid, dto, options),
      TimerDataPointModel
    );
  }

  async stopTimer(
    cid: string,
    dto: TimerUpdateModel,
    options?: IProfileApiRequestOptions
  ): Promise<UpdateHabitDataPointTimerResponse> {
    return unwrapAndTransformResponse(
      repository.stopTimer(cid, dto, options),
      UpdateHabitDataPointTimerResponse
    );
  }
}

export const useHabitsClient = useSingleton(() => new HabitsClient());
