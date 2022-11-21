import {
  CreateHabitDto,
  UpdateDataPointDto,
  UpdateHabitDto,
  UpdateHabitResponseDto,
  UpdateHabitDataPointResultDto,
  TimerUpdate,
} from '../dtos';
import { Endpoint } from '@/endpoints';
import { NumberDataPointModel } from '@/time-series';

export interface IHabitsEndpointService {
  create(dto: CreateHabitDto): Promise<UpdateHabitResponseDto>;
  update(id: string, update: UpdateHabitDto): Promise<UpdateHabitResponseDto>;
  updateDataPoint(id: string, update: UpdateDataPointDto): Promise<UpdateHabitDataPointResultDto>;
  startTimer(id: string, dto: TimerUpdate): Promise<NumberDataPointModel>;
  stopTimer(id: string, dto: TimerUpdate): Promise<UpdateHabitDataPointResultDto>;
}

export type HabitsEndpoint = Endpoint<IHabitsEndpointService>;
