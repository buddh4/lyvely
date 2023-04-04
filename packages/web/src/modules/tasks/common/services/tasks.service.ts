import {
  useSingleton,
  ITasksEndpointService,
  CreateTaskModel,
  UpdateTaskResponse,
  UpdateTaskModel,
  UpdateTaskStateModel,
  UpdateTaskStateResponse,
  CalendarDate,
  formatDate,
  TimerModel,
  TimerValueUpdateModel,
  DataPointIntervalFilter,
  ICalendarPlanResponse,
  SortAction,
  SortResponse,
  TaskModel,
} from '@lyvely/common';

import repository from '../repositories/tasks.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

export class TasksService implements ITasksEndpointService {
  async getByFilter(filter: DataPointIntervalFilter): Promise<ICalendarPlanResponse<TaskModel>> {
    const { models } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((task) => new TaskModel(task)),
    };
  }

  sort(cid: string, move: SortAction): Promise<SortResponse> {
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

export const useTasksService = useSingleton(() => new TasksService());