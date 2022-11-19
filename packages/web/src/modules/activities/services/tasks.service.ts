import {
  useSingleton,
  ITasksEndpointService,
  CreateTaskDto,
  UpdateTaskResponseDto,
  UpdateTaskDto,
  UpdateTaskStateModel,
  UpdateTaskStateResultDto,
  CalendarDate,
  formatDate,
} from '@lyvely/common';

import repository from '../repositories/tasks.repository';
import { unwrapAndCastResponse } from '@/modules/core';

export class TasksService implements ITasksEndpointService {
  async create(dto: CreateTaskDto): Promise<UpdateTaskResponseDto> {
    return unwrapAndCastResponse(repository.create(dto), UpdateTaskResponseDto);
  }

  update(id: string, update: UpdateTaskDto): Promise<UpdateTaskResponseDto> {
    return unwrapAndCastResponse(repository.update(id, update), UpdateTaskResponseDto);
  }

  setDone(id: string, date: CalendarDate): Promise<UpdateTaskStateResultDto> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndCastResponse(repository.setDone(id, dto), UpdateTaskStateResultDto);
  }

  setUndone(id: string, date: CalendarDate): Promise<UpdateTaskStateResultDto> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndCastResponse(repository.setUndone(id, dto), UpdateTaskStateResultDto);
  }
}

export const useTasksService = useSingleton(() => new TasksService());
