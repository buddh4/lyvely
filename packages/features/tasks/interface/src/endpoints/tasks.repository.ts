import { ITasksClient, ENDPOINT_TASKS, TasksEndpointPaths } from './tasks.endpoint';
import { UpdateTaskStateModel, UpdateTaskModel } from '../models';
import { TimerValueUpdateModel } from '@lyvely/timers-interface';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-interface';
import { IProfileApiRequestOptions, useApi } from '@lyvely/interface';

const api = useApi<ITasksClient>(ENDPOINT_TASKS);

export default {
  async getByFilter(filter: CalendarPlanFilter, options?: IProfileApiRequestOptions) {
    return api.get<'getByFilter'>({
      params: filter,
      ...options,
    });
  },

  async create(task: UpdateTaskModel, options?: IProfileApiRequestOptions) {
    return api.post<'create'>(task, {}, options);
  },

  async update(
    taskId: string,
    model: Partial<UpdateTaskModel>,
    options?: IProfileApiRequestOptions,
  ) {
    return api.put<'update'>(taskId, model, options);
  },

  async sort(cid: string, moveAction: CalendarPlanSort, options?: IProfileApiRequestOptions) {
    return api.post<'sort'>(TasksEndpointPaths.SORT(cid), moveAction, options);
  },

  async setDone(cid: string, dto: UpdateTaskStateModel, options?: IProfileApiRequestOptions) {
    return api.post<'setDone'>(TasksEndpointPaths.SET_DONE(cid), dto, options);
  },

  async setUndone(cid: string, dto: UpdateTaskStateModel, options?: IProfileApiRequestOptions) {
    return api.post<'setUndone'>(TasksEndpointPaths.SET_UNDONE(cid), dto, options);
  },

  async startTimer(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'startTimer'>(TasksEndpointPaths.START_TIMER(cid), {}, options);
  },

  async stopTimer(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'stopTimer'>(TasksEndpointPaths.STOP_TIMER(cid), {}, options);
  },

  async updateTimer(
    cid: string,
    model: TimerValueUpdateModel,
    options?: IProfileApiRequestOptions,
  ) {
    return api.post<'stopTimer'>(TasksEndpointPaths.UPDATE_TIMER(cid), model, options);
  },
};
