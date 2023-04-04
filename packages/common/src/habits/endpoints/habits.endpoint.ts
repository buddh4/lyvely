import { Endpoint } from '@/endpoints';
import { NumberDataPointModel } from '@/time-series';
import { IContentTypeService } from '@/content';
import {
  HabitModel,
  UpdateHabitModel,
  CreateHabitModel,
  UpdateHabitDataPointModel,
  UpdateHabitDataPointResponse,
  TimerUpdateModel,
} from '../models';
import { ICalendarPlanService } from '@/calendar-plan';

export interface IHabitsEndpointService
  extends IContentTypeService<HabitModel, CreateHabitModel, UpdateHabitModel>,
    ICalendarPlanService<HabitModel> {
  updateDataPoint(
    cid: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse>;
  startTimer(cid: string, dto: TimerUpdateModel): Promise<NumberDataPointModel>;
  stopTimer(cid: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointResponse>;
}

export type HabitsEndpoint = Endpoint<IHabitsEndpointService>;
