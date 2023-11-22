import { Endpoint } from '@lyvely/common';
import { ITimeSeriesCalendarPlanService, TimerDataPointModel } from '@lyvely/time-series-interface';
import { IContentTypeService } from '@lyvely/interface';
import {
  HabitModel,
  UpdateHabitModel,
  CreateHabitModel,
  UpdateHabitDataPointModel,
  UpdateHabitDataPointResponse,
} from '../models';
import { TimerUpdateModel } from '@lyvely/timers-interface';

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
