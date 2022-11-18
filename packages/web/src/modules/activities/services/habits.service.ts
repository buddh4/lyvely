import {
  CreateHabitDto,
  IHabitsEndpointService,
  NumberDataPointModel,
  TimerUpdate,
  UpdateDataPointDto,
  UpdateHabitDto,
  UpdateHabitResponseDto,
  UpdateDataPointResultDto,
  useSingleton,
} from '@lyvely/common';
import repository from '../repositories/habits.repository';
import { unwrapAndCastEndpointRequest } from '@/modules/core';

export class HabitsService implements IHabitsEndpointService {
  async create(dto: CreateHabitDto): Promise<UpdateHabitResponseDto> {
    return unwrapAndCastEndpointRequest(repository.create(dto), UpdateHabitResponseDto);
  }

  async update(id: string, update: UpdateHabitDto): Promise<UpdateHabitResponseDto> {
    return unwrapAndCastEndpointRequest(repository.update(id, update), UpdateHabitResponseDto);
  }

  async updateDataPoint(id: string, update: UpdateDataPointDto): Promise<UpdateDataPointResultDto> {
    return unwrapAndCastEndpointRequest(repository.updateDataPoint(id, update), UpdateDataPointResultDto);
  }

  async startTimer(id: string, dto: TimerUpdate): Promise<NumberDataPointModel> {
    return unwrapAndCastEndpointRequest(repository.startTimer(id, dto), NumberDataPointModel);
  }

  async stopTimer(id: string, dto: TimerUpdate): Promise<NumberDataPointModel> {
    return unwrapAndCastEndpointRequest(repository.stopTimer(id, dto), NumberDataPointModel);
  }
}

export const useHabitsService = useSingleton(() => new HabitsService());
