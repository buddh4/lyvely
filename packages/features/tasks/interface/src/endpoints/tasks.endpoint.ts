import { Endpoint } from '@lyvely/common';
import { CalendarDate } from '@lyvely/dates';
import { TimerModel } from '@lyvely/timers-interface';
import {
  UpdateTaskResponse,
  TaskModel,
  UpdateTaskStateResponse,
  UpdateTaskModel,
  CreateTaskModel,
} from '../models';
import { IContentTypeClient } from '@lyvely/interface';
import { ICalendarPlanClient } from '@lyvely/calendar-plan-interface';

export interface ITasksEndpointService
  extends IContentTypeClient<TaskModel, CreateTaskModel, UpdateTaskModel>,
    ICalendarPlanClient<TaskModel> {
  create(dto: CreateTaskModel): Promise<UpdateTaskResponse>;
  update(id: string, update: UpdateTaskModel): Promise<UpdateTaskResponse>;
  setDone(id: string, date: CalendarDate): Promise<UpdateTaskStateResponse>;
  setUndone(id: string, date: CalendarDate): Promise<UpdateTaskStateResponse>;
  startTimer(id: string): Promise<TimerModel>;
  stopTimer(id: string): Promise<TimerModel>;
  updateTimer(id: string, value: number): Promise<TimerModel>;
}

export type TasksEndpoint = Endpoint<ITasksEndpointService>;
export const ENDPOINT_TASKS = 'tasks';
