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
import { unwrapAndCastResponse } from '@/modules/core';

export class HabitsService implements IHabitsEndpointService {
  async create(dto: CreateHabitModel): Promise<UpdateHabitResponse> {
    return unwrapAndCastResponse(repository.create(dto), UpdateHabitResponse);
  }

  async update(id: string, update: UpdateHabitModel): Promise<UpdateHabitResponse> {
    return unwrapAndCastResponse(repository.update(id, update), UpdateHabitResponse);
  }

  async updateDataPoint(
    id: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse> {
    return unwrapAndCastResponse(
      repository.updateDataPoint(id, update),
      UpdateHabitDataPointResponse,
    );
  }

  async startTimer(id: string, dto: TimerUpdateModel): Promise<NumberDataPointModel> {
    return unwrapAndCastResponse(repository.startTimer(id, dto), NumberDataPointModel);
  }

  async stopTimer(id: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointResponse> {
    return unwrapAndCastResponse(repository.stopTimer(id, dto), UpdateHabitDataPointResponse);
  }
}

export const useHabitsService = useSingleton(() => new HabitsService());
