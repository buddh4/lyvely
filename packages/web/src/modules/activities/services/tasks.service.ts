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
  TimerModel,
  TimerUpdate,
  TimerValueUpdate,
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

  startTimer(id: string): Promise<TimerModel> {
    return unwrapAndCastResponse(repository.startTimer(id), TimerModel);
  }

  stopTimer(id: string): Promise<TimerModel> {
    return unwrapAndCastResponse(repository.stopTimer(id), TimerModel);
  }

  updateTimer(id: string, value: number): Promise<TimerModel> {
    const dto = new TimerValueUpdate(value);
    return unwrapAndCastResponse(repository.updateTimer(id, dto), TimerModel);
  }
}

export const useTasksService = useSingleton(() => new TasksService());
