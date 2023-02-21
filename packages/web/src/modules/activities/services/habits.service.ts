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
} from '@lyvely/common';
import repository from '../repositories/habits.repository';
import { unwrapAndTransformResponse } from '@/modules/core';

export class HabitsService implements IHabitsEndpointService {
  async create(dto: CreateHabitModel): Promise<UpdateHabitResponse> {
    return unwrapAndTransformResponse(repository.create(dto), UpdateHabitResponse);
  }

  async update(id: string, update: UpdateHabitModel): Promise<UpdateHabitResponse> {
    return unwrapAndTransformResponse(repository.update(id, update), UpdateHabitResponse);
  }

  async updateDataPoint(
    id: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse> {
    return unwrapAndTransformResponse(
      repository.updateDataPoint(id, update),
      UpdateHabitDataPointResponse,
    );
  }

  async startTimer(id: string, dto: TimerUpdateModel): Promise<NumberDataPointModel> {
    return unwrapAndTransformResponse(repository.startTimer(id, dto), NumberDataPointModel);
  }

  async stopTimer(id: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointResponse> {
    return unwrapAndTransformResponse(repository.stopTimer(id, dto), UpdateHabitDataPointResponse);
  }
}

export const useHabitsService = useSingleton(() => new HabitsService());
