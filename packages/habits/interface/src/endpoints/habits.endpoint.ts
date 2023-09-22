import { Endpoint } from '@lyvely/core';
import {
  ITimeSeriesCalendarPlanService,
  NumberDataPointModel,
  TimerDataPointModel,
} from '@lyvely/time-series';
import { IContentTypeService } from '@lyvely/content';
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
