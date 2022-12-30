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
} from '@lyvely/common';

import repository from '../repositories/tasks.repository';
import { unwrapAndCastResponse } from '@/modules/core';

export class TasksService implements ITasksEndpointService {
  async create(dto: CreateTaskModel): Promise<UpdateTaskResponse> {
    return unwrapAndCastResponse(repository.create(dto), UpdateTaskResponse);
  }

  update(id: string, update: UpdateTaskModel): Promise<UpdateTaskResponse> {
    return unwrapAndCastResponse(repository.update(id, update), UpdateTaskResponse);
  }

  setDone(id: string, date: CalendarDate): Promise<UpdateTaskStateResponse> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndCastResponse(repository.setDone(id, dto), UpdateTaskStateResponse);
  }

  setUndone(id: string, date: CalendarDate): Promise<UpdateTaskStateResponse> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndCastResponse(repository.setUndone(id, dto), UpdateTaskStateResponse);
  }

  startTimer(id: string): Promise<TimerModel> {
    return unwrapAndCastResponse(repository.startTimer(id), TimerModel);
  }

  stopTimer(id: string): Promise<TimerModel> {
    return unwrapAndCastResponse(repository.stopTimer(id), TimerModel);
  }

  updateTimer(id: string, value: number): Promise<TimerModel> {
    const dto = new TimerValueUpdateModel(value);
    return unwrapAndCastResponse(repository.updateTimer(id, dto), TimerModel);
  }
}

export const useTasksService = useSingleton(() => new TasksService());
