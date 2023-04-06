import repository from '@/repository';
import {
  UpdateTaskStateModel,
  UpdateTaskModel,
  EndpointResult,
  ITasksEndpointService,
  TimerValueUpdateModel,
  DataPointIntervalFilter,
  ENDPOINT_TASKS,
  SortAction,
} from '@lyvely/common';

export default {
  async getByFilter(filter: DataPointIntervalFilter) {
    return repository.get<EndpointResult<ITasksEndpointService['getByFilter']>>(ENDPOINT_TASKS, {
      params: filter,
    });
  },

  async sort(cid: string, moveAction: SortAction) {
    return repository.post<EndpointResult<ITasksEndpointService['sort']>>(
      `${ENDPOINT_TASKS}/${cid}/sort`,
      moveAction,
    );
  },

  async create(task: UpdateTaskModel) {
    return repository.post<EndpointResult<ITasksEndpointService['create']>>(
      `${ENDPOINT_TASKS}`,
      task,
    );
  },

  async setDone(id: string, dto: UpdateTaskStateModel) {
    return repository.post<EndpointResult<ITasksEndpointService['setDone']>>(
      `${ENDPOINT_TASKS}/${id}/done`,
      dto,
    );
  },

  async setUndone(id: string, dto: UpdateTaskStateModel) {
    return repository.post<EndpointResult<ITasksEndpointService['setUndone']>>(
      `${ENDPOINT_TASKS}/${id}/undone`,
      dto,
    );
  },

  async update(taskId: string, model: Partial<UpdateTaskModel>) {
    return repository.put<EndpointResult<ITasksEndpointService['update']>>(
      `${ENDPOINT_TASKS}/${taskId}`,
      model,
    );
  },

  async startTimer(taskId: string) {
    return repository.post<EndpointResult<ITasksEndpointService['startTimer']>>(
      `${ENDPOINT_TASKS}/${taskId}/start-timer`,
    );
  },

  async stopTimer(taskId: string) {
    return repository.post<EndpointResult<ITasksEndpointService['stopTimer']>>(
      `${ENDPOINT_TASKS}/${taskId}/stop-timer`,
    );
  },

  async updateTimer(taskId: string, model: TimerValueUpdateModel) {
    return repository.post<EndpointResult<ITasksEndpointService['stopTimer']>>(
      `${ENDPOINT_TASKS}/${taskId}/update-timer`,
      model,
    );
  },
};
