import {
  CreateTaskModel,
  UpdateTaskResponse,
  UpdateTaskModel,
  UpdateTaskStateModel,
  UpdateTaskStateResponse,
  TaskModel,
} from '../models';
import { ITasksClient } from './tasks.endpoint';
import { SortResponse, useSingleton } from '@lyvely/common';
import { TimerModel, TimerValueUpdateModel } from '@lyvely/timers-interface';
import { formatDate, CalendarDate } from '@lyvely/dates';
import {
  CalendarPlanFilter,
  ICalendarPlanResponse,
  CalendarPlanSort,
} from '@lyvely/calendar-plan-web';

import repository from './tasks.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@lyvely/interface';

export class TasksClient implements ITasksClient {
  async getByFilter(filter: CalendarPlanFilter): Promise<ICalendarPlanResponse<TaskModel>> {
    const { models } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((task) => new TaskModel(task)),
    };
  }

  sort(cid: string, move: CalendarPlanSort): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }

  async create(dto: CreateTaskModel): Promise<UpdateTaskResponse> {
    return unwrapAndTransformResponse(repository.create(dto), UpdateTaskResponse);
  }

  update(id: string, update: UpdateTaskModel): Promise<UpdateTaskResponse> {
    return unwrapAndTransformResponse(repository.update(id, update), UpdateTaskResponse);
  }

  setDone(id: string, date: CalendarDate): Promise<UpdateTaskStateResponse> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndTransformResponse(repository.setDone(id, dto), UpdateTaskStateResponse);
  }

  setUndone(id: string, date: CalendarDate): Promise<UpdateTaskStateResponse> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndTransformResponse(repository.setUndone(id, dto), UpdateTaskStateResponse);
  }

  startTimer(id: string): Promise<TimerModel> {
    return unwrapAndTransformResponse(repository.startTimer(id), TimerModel);
  }

  stopTimer(id: string): Promise<TimerModel> {
    return unwrapAndTransformResponse(repository.stopTimer(id), TimerModel);
  }

  updateTimer(id: string, value: number): Promise<TimerModel> {
    const dto = new TimerValueUpdateModel(value);
    return unwrapAndTransformResponse(repository.updateTimer(id, dto), TimerModel);
  }
}

export const useTasksClient = useSingleton(() => new TasksClient());