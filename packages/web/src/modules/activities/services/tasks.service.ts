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
import { unwrapAndCastEndpointRequest } from '@/modules/core';

export class TasksService implements ITasksEndpointService {
  async create(dto: CreateTaskDto): Promise<UpdateTaskResponseDto> {
    return unwrapAndCastEndpointRequest(repository.create(dto), UpdateTaskResponseDto);
  }

  update(id: string, update: UpdateTaskDto): Promise<UpdateTaskResponseDto> {
    return unwrapAndCastEndpointRequest(repository.update(id, update), UpdateTaskResponseDto);
  }

  setDone(id: string, date: CalendarDate): Promise<UpdateTaskStateResultDto> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndCastEndpointRequest(repository.setDone(id, dto), UpdateTaskStateResultDto);
  }

  setUndone(id: string, date: CalendarDate): Promise<UpdateTaskStateResultDto> {
    const dto = new UpdateTaskStateModel({ date: formatDate(date) });
    return unwrapAndCastEndpointRequest(repository.setUndone(id, dto), UpdateTaskStateResultDto);
  }
}

export const useTasksService = useSingleton(() => new TasksService());
