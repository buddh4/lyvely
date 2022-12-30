import repository from '@/repository';
import {
  UpdateTaskStateModel,
  UpdateTaskModel,
  EndpointResult,
  ITasksEndpointService,
  TimerValueUpdateModel,
} from '@lyvely/common';

const resource = 'tasks';

export default {
  async create(activitiy: UpdateTaskModel) {
    return repository.post<EndpointResult<ITasksEndpointService['create']>>(
      `${resource}`,
      activitiy,
    );
  },

  async setDone(id: string, dto: UpdateTaskStateModel) {
    return repository.post<EndpointResult<ITasksEndpointService['setDone']>>(
      `${resource}/${id}/done`,
      dto,
    );
  },

  async setUndone(id: string, dto: UpdateTaskStateModel) {
    return repository.post<EndpointResult<ITasksEndpointService['setUndone']>>(
      `${resource}/${id}/undone`,
      dto,
    );
  },

  async update(taskId: string, model: Partial<UpdateTaskModel>) {
    return repository.put<EndpointResult<ITasksEndpointService['update']>>(
      `${resource}/${taskId}`,
      model,
    );
  },

  async startTimer(taskId: string) {
    return repository.post<EndpointResult<ITasksEndpointService['startTimer']>>(
      `${resource}/${taskId}/start-timer`,
    );
  },

  async stopTimer(taskId: string) {
    return repository.post<EndpointResult<ITasksEndpointService['stopTimer']>>(
      `${resource}/${taskId}/stop-timer`,
    );
  },

  async updateTimer(taskId: string, model: TimerValueUpdateModel) {
    return repository.post<EndpointResult<ITasksEndpointService['stopTimer']>>(
      `${resource}/${taskId}/update-timer`,
      model,
    );
  },
};
