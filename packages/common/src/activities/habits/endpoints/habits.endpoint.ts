import { Endpoint } from '@/endpoints';
import { NumberDataPointModel } from '@/time-series';
import { IAbstractContentService } from '@/content';
import {
  HabitModel,
  UpdateHabitResponse,
  UpdateHabitModel,
  CreateHabitModel,
  UpdateHabitDataPointModel,
  UpdateHabitDataPointResponse,
  TimerUpdateModel,
} from '../models';

export interface IHabitsEndpointService
  extends IAbstractContentService<HabitModel, CreateHabitModel, UpdateHabitModel> {
  create(dto: CreateHabitModel): Promise<UpdateHabitResponse>;
  update(id: string, update: UpdateHabitModel): Promise<UpdateHabitResponse>;
  updateDataPoint(
    id: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse>;
  startTimer(id: string, dto: TimerUpdateModel): Promise<NumberDataPointModel>;
  stopTimer(id: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointResponse>;
}

export type HabitsEndpoint = Endpoint<IHabitsEndpointService>;
