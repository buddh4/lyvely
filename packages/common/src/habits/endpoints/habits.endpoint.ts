import { Endpoint } from '@/endpoints';
import {
  ITimeSeriesCalendarPlanService,
  NumberDataPointModel,
  TimerDataPointModel,
} from '@/time-series';
import { IContentTypeService } from '@/content';
import {
  HabitModel,
  UpdateHabitModel,
  CreateHabitModel,
  UpdateHabitDataPointModel,
  UpdateHabitDataPointResponse,
  TimerUpdateModel,
} from '../models';

export interface IHabitsEndpointService
  extends IContentTypeService<HabitModel, CreateHabitModel, UpdateHabitModel>,
    ITimeSeriesCalendarPlanService<HabitModel> {
  updateDataPoint(
    cid: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse>;
  startTimer(cid: string, dto: TimerUpdateModel): Promise<TimerDataPointModel>;
  stopTimer(cid: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointResponse>;
}

export type HabitsEndpoint = Endpoint<IHabitsEndpointService>;
export const ENDPOINT_HABITS = 'habits';
