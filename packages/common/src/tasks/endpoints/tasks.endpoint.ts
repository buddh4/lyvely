import { Endpoint } from '@/endpoints';
import { CalendarDate, TimerModel } from '@/calendar';
import {
  UpdateTaskResponse,
  TaskModel,
  UpdateTaskStateResponse,
  UpdateTaskModel,
  CreateTaskModel,
} from '../models';
import { IContentTypeService } from '@/content';
import { ICalendarPlanService } from '@/calendar-plan';

export interface ITasksEndpointService
  extends IContentTypeService<TaskModel, CreateTaskModel, UpdateTaskModel>,
    ICalendarPlanService<TaskModel> {
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
