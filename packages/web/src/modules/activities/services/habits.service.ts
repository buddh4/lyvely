import {
  CreateHabitDto,
  IHabitsEndpointService,
  NumberDataPointModel,
  TimerUpdate,
  UpdateDataPointDto,
  UpdateHabitDto,
  UpdateHabitResponseDto,
  UpdateHabitDataPointResultDto,
  useSingleton,
} from '@lyvely/common';
import repository from '../repositories/habits.repository';
import { unwrapAndCastResponse } from '@/modules/core';

export class HabitsService implements IHabitsEndpointService {
  async create(dto: CreateHabitDto): Promise<UpdateHabitResponseDto> {
    return unwrapAndCastResponse(repository.create(dto), UpdateHabitResponseDto);
  }

  async update(id: string, update: UpdateHabitDto): Promise<UpdateHabitResponseDto> {
    return unwrapAndCastResponse(repository.update(id, update), UpdateHabitResponseDto);
  }

  async updateDataPoint(id: string, update: UpdateDataPointDto): Promise<UpdateHabitDataPointResultDto> {
    return unwrapAndCastResponse(repository.updateDataPoint(id, update), UpdateHabitDataPointResultDto);
  }

  async startTimer(id: string, dto: TimerUpdate): Promise<NumberDataPointModel> {
    return unwrapAndCastResponse(repository.startTimer(id, dto), NumberDataPointModel);
  }

  async stopTimer(id: string, dto: TimerUpdate): Promise<UpdateHabitDataPointResultDto> {
    return unwrapAndCastResponse(repository.stopTimer(id, dto), UpdateHabitDataPointResultDto);
  }
}

export const useHabitsService = useSingleton(() => new HabitsService());
