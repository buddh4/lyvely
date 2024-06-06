import { Endpoint, IContentTypeClient, profileApiPrefix, TimerModel } from '@lyvely/interface';
import { CalendarDate } from '@lyvely/dates';
import {
  UpdateTaskResponse,
  TaskModel,
  UpdateTaskStateResponse,
  UpdateTaskModel,
  CreateTaskModel,
} from '../models';
import { ICalendarPlanClient } from '@lyvely/calendar-plan-interface';

export interface ITasksClient
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

export type TasksEndpoint = Endpoint<ITasksClient>;
export const ENDPOINT_TASKS = profileApiPrefix('tasks');

export const TasksEndpoints = {
  SORT: (cid: string) => `${cid}/sort`,
  CREATE: (cid: string) => `${cid}/create`,
  SET_DONE: (cid: string) => `${cid}/done`,
  SET_UNDONE: (cid: string) => `${cid}/undone`,
  START_TIMER: (cid: string) => `${cid}/start-timer`,
  STOP_TIMER: (cid: string) => `${cid}/stop-timer`,
  UPDATE_TIMER: (cid: string) => `${cid}/update-timer`,
};
