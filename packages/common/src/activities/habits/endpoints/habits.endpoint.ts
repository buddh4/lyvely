import { Endpoint } from '@/endpoints';
import { NumberDataPointModel } from '@/time-series';
import { IContentTypeService } from '@/content';
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
  extends IContentTypeService<HabitModel, CreateHabitModel, UpdateHabitModel> {
  create(dto: CreateHabitModel): Promise<UpdateHabitResponse>;
  update(cid: string, update: UpdateHabitModel): Promise<UpdateHabitResponse>;
  updateDataPoint(
    cid: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse>;
  startTimer(cid: string, dto: TimerUpdateModel): Promise<NumberDataPointModel>;
  stopTimer(cid: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointResponse>;
}

export type HabitsEndpoint = Endpoint<IHabitsEndpointService>;
