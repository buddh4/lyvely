import { ITimeSeriesCalendarPlanClient, TimerDataPointModel } from '@lyvely/time-series-interface';
import { IContentTypeClient, profileApiPrefix, Endpoint } from '@lyvely/interface';
import {
  HabitModel,
  UpdateHabitModel,
  CreateHabitModel,
  UpdateHabitDataPointModel,
  UpdateHabitDataPointResponse,
  UpdateHabitDataPointTimerResponse,
} from '../models';
import { TimerUpdateModel } from '@lyvely/timers-interface';

export interface IHabitsEndpointClient
  extends IContentTypeClient<HabitModel, CreateHabitModel, UpdateHabitModel>,
    ITimeSeriesCalendarPlanClient<HabitModel> {
  updateDataPoint(
    cid: string,
    update: UpdateHabitDataPointModel,
  ): Promise<UpdateHabitDataPointResponse>;
  startTimer(cid: string, dto: TimerUpdateModel): Promise<TimerDataPointModel>;
  stopTimer(cid: string, dto: TimerUpdateModel): Promise<UpdateHabitDataPointTimerResponse>;
}

export type HabitsEndpoint = Endpoint<IHabitsEndpointClient>;
export const ENDPOINT_HABITS = profileApiPrefix('habits');

export const HabitsEndpoints = {
  SORT: (cid: string) => `${cid}/sort`,
  UPDATE_DATA_POINT: (cid: string) => `${cid}/update-data-point`,
  START_TIMER: (cid: string) => `${cid}/start-timer`,
  STOP_TIMER: (cid: string) => `${cid}/stop-timer`,
};
