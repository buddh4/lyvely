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
import { TimerUpdateModel } from '@lyvely/timers-interface';
import { SortResponse, useSingleton } from '@lyvely/common';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { useDataPointStrategyFacade, TimerDataPointModel } from '@lyvely/time-series-interface';
import repository from './habits.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@lyvely/interface';

export class HabitsClient implements IHabitsEndpointClient {
  async getByFilter(filter: CalendarPlanFilter) {
    const { models, dataPoints } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((habit) => new HabitModel(habit)),
      dataPoints: dataPoints?.map((dataPoint) =>
        useDataPointStrategyFacade().createDataPoint(dataPoint),
      ),
    };
  }

  sort(cid: string, sort: CalendarPlanSort): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, sort), SortResponse);
  }

  async create(dto: CreateHabitModel): Promise<UpdateHabitResponse> {
    return unwrapAndTransformResponse(repository.create(dto), UpdateHabitResponse);
  }

  async update(cid: string, update: UpdateHabitModel): Promise<UpdateHabitResponse> {
    return unwrapAndTransformResponse(repository.update(cid, update), UpdateHabitResponse);
  }

  async updateDataPoint(
    cid: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse> {
    const result = await unwrapResponse(repository.updateDataPoint(cid, update));
    result.dataPoint = useDataPointStrategyFacade().createDataPoint(result.dataPoint);
    result.model = new HabitModel(result.model);
    return result;
  }

  async startTimer(cid: string, dto: TimerUpdateModel): Promise<TimerDataPointModel> {
    return unwrapAndTransformResponse(repository.startTimer(cid, dto), TimerDataPointModel);
  }

  async stopTimer(cid: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointTimerResponse> {
    return unwrapAndTransformResponse(
      repository.stopTimer(cid, dto),
      UpdateHabitDataPointTimerResponse,
    );
  }
}

export const useHabitsClient = useSingleton(() => new HabitsClient());
