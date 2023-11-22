import {
  UpdateTaskStateModel,
  UpdateTaskModel,
  ITasksEndpointService,
  ENDPOINT_TASKS,
} from '@lyvely/tasks-interface';
import { EndpointResult } from '@lyvely/common';
import { TimerValueUpdateModel } from '@lyvely/timers-interface';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-web';
import { useApiRepository } from '@lyvely/interface';

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return useApiRepository().get<EndpointResult<ITasksEndpointService['getByFilter']>>(
      ENDPOINT_TASKS,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return useApiRepository().post<EndpointResult<ITasksEndpointService['sort']>>(
      `${ENDPOINT_TASKS}/${cid}/sort`,
      moveAction,
    );
  },

  async create(task: UpdateTaskModel) {
    return useApiRepository().post<EndpointResult<ITasksEndpointService['create']>>(
      `${ENDPOINT_TASKS}`,
      task,
    );
  },

  async setDone(id: string, dto: UpdateTaskStateModel) {
    return useApiRepository().post<EndpointResult<ITasksEndpointService['setDone']>>(
      `${ENDPOINT_TASKS}/${id}/done`,
      dto,
    );
  },

  async setUndone(id: string, dto: UpdateTaskStateModel) {
    return useApiRepository().post<EndpointResult<ITasksEndpointService['setUndone']>>(
      `${ENDPOINT_TASKS}/${id}/undone`,
      dto,
    );
  },

  async update(taskId: string, model: Partial<UpdateTaskModel>) {
    return useApiRepository().put<EndpointResult<ITasksEndpointService['update']>>(
      `${ENDPOINT_TASKS}/${taskId}`,
      model,
    );
  },

  async startTimer(taskId: string) {
    return useApiRepository().post<EndpointResult<ITasksEndpointService['startTimer']>>(
      `${ENDPOINT_TASKS}/${taskId}/start-timer`,
    );
  },

  async stopTimer(taskId: string) {
    return useApiRepository().post<EndpointResult<ITasksEndpointService['stopTimer']>>(
      `${ENDPOINT_TASKS}/${taskId}/stop-timer`,
    );
  },

  async updateTimer(taskId: string, model: TimerValueUpdateModel) {
    return useApiRepository().post<EndpointResult<ITasksEndpointService['stopTimer']>>(
      `${ENDPOINT_TASKS}/${taskId}/update-timer`,
      model,
    );
  },
};
