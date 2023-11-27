import {
  CreateTaskModel,
  UpdateTaskResponse,
  UpdateTaskModel,
  UpdateTaskStateModel,
  UpdateTaskStateResponse,
  TaskModel,
} from '../models';
import { ITasksClient } from './tasks.endpoint';
import { useSingleton } from '@lyvely/common';
import {
  SortResponse,
  IProfileApiRequestOptions,
  unwrapAndTransformResponse,
  unwrapResponse,
} from '@lyvely/interface';
import { TimerModel, TimerValueUpdateModel } from '@lyvely/timers-interface';
import { formatDate, CalendarDate } from '@lyvely/dates';
import {
  CalendarPlanFilter,
  ICalendarPlanResponse,
  CalendarPlanSort,
} from '@lyvely/calendar-plan-web';

import repository from './tasks.repository';

export class TasksClient implements ITasksClient {
  async getByFilter(
    filter: CalendarPlanFilter,
    options?: IProfileApiRequestOptions,
  ): Promise<ICalendarPlanResponse<TaskModel>> {
    const { models } = await unwrapResponse(repository.getByFilter(filter, options));
    return {
      models: models.map((task) => new TaskModel(task)),
    };
  }

  sort(
    cid: string,
    move: CalendarPlanSort,
    options?: IProfileApiRequestOptions,
  ): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move, options), SortResponse);
  }

  async create(
    dto: CreateTaskModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateTaskResponse> {
    return unwrapAndTransformResponse(repository.create(dto, options), UpdateTaskResponse);
  }

  update(
    id: string,
    update: UpdateTaskModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateTaskResponse> {
    return unwrapAndTransformResponse(repository.update(id, update, options), UpdateTaskResponse);
  }

  setDone(
    id: string,
    date: CalendarDate,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateTaskStateResponse> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndTransformResponse(
      repository.setDone(id, dto, options),
      UpdateTaskStateResponse,
    );
  }

  setUndone(
    id: string,
    date: CalendarDate,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateTaskStateResponse> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndTransformResponse(
      repository.setUndone(id, dto, options),
      UpdateTaskStateResponse,
    );
  }

  startTimer(id: string, options?: IProfileApiRequestOptions): Promise<TimerModel> {
    return unwrapAndTransformResponse(repository.startTimer(id, options), TimerModel);
  }

  stopTimer(id: string, options?: IProfileApiRequestOptions): Promise<TimerModel> {
    return unwrapAndTransformResponse(repository.stopTimer(id, options), TimerModel);
  }

  updateTimer(id: string, value: number, options?: IProfileApiRequestOptions): Promise<TimerModel> {
    const dto = new TimerValueUpdateModel(value);
    return unwrapAndTransformResponse(repository.updateTimer(id, dto, options), TimerModel);
  }
}

export const useTasksClient = useSingleton(() => new TasksClient());
