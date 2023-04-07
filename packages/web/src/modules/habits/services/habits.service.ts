import {
  CreateHabitModel,
  IHabitsEndpointService,
  NumberDataPointModel,
  TimerUpdateModel,
  UpdateHabitDataPointModel,
  UpdateHabitModel,
  UpdateHabitResponse,
  UpdateHabitDataPointResponse,
  useSingleton,
  CalendarPlanFilter,
  HabitModel,
  CalendarPlanSort,
  SortResponse,
  useDataPointStrategyFacade,
} from '@lyvely/common';
import repository from '../repositories/habits.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export class HabitsService implements IHabitsEndpointService {
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
    const result = await unwrapAndTransformResponse(
      repository.updateDataPoint(cid, update),
      UpdateHabitDataPointResponse,
    );

    useProfileStore().updateScore(result.score);

    return result;
  }

  async startTimer(cid: string, dto: TimerUpdateModel): Promise<NumberDataPointModel> {
    return unwrapAndTransformResponse(repository.startTimer(cid, dto), NumberDataPointModel);
  }

  async stopTimer(cid: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointResponse> {
    return unwrapAndTransformResponse(repository.stopTimer(cid, dto), UpdateHabitDataPointResponse);
  }
}

export const useHabitsService = useSingleton(() => new HabitsService());
