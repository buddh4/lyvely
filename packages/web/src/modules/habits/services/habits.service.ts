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

  async update(cid: string, update: UpdateHabitModel): Promise<UpdateHabitResponse> {
    return unwrapAndTransformResponse(repository.update(cid, update), UpdateHabitResponse);
  }

  async updateDataPoint(
    cid: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse> {
    return unwrapAndTransformResponse(
      repository.updateDataPoint(cid, update),
      UpdateHabitDataPointResponse,
    );
  }

  async startTimer(cid: string, dto: TimerUpdateModel): Promise<NumberDataPointModel> {
    return unwrapAndTransformResponse(repository.startTimer(cid, dto), NumberDataPointModel);
  }

  async stopTimer(cid: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointResponse> {
    return unwrapAndTransformResponse(repository.stopTimer(cid, dto), UpdateHabitDataPointResponse);
  }
}

export const useHabitsService = useSingleton(() => new HabitsService());
