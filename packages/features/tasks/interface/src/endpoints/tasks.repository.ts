import { ITasksClient, ENDPOINT_TASKS, TasksEndpointPaths } from './tasks.endpoint';
import { UpdateTaskStateModel, UpdateTaskModel } from '../models';
import { TimerValueUpdateModel } from '@lyvely/timers-interface';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan-interface';
import { useApi } from '@lyvely/interface';

const api = useApi<ITasksClient>(ENDPOINT_TASKS);

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return api.get<'getByFilter'>({
      params: filter,
    });
  },

  async create(task: UpdateTaskModel) {
    return api.post<'create'>(task);
  },

  async update(taskId: string, model: Partial<UpdateTaskModel>) {
    return api.put<'update'>(taskId, model);
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return api.post<'sort'>(TasksEndpointPaths.SORT(cid), moveAction);
  },

  async setDone(cid: string, dto: UpdateTaskStateModel) {
    return api.post<'setDone'>(TasksEndpointPaths.SET_DONE(cid), dto);
  },

  async setUndone(cid: string, dto: UpdateTaskStateModel) {
    return api.post<'setUndone'>(TasksEndpointPaths.SET_UNDONE(cid), dto);
  },

  async startTimer(cid: string) {
    return api.post<'startTimer'>(TasksEndpointPaths.START_TIMER(cid));
  },

  async stopTimer(cid: string) {
    return api.post<'stopTimer'>(TasksEndpointPaths.STOP_TIMER(cid));
  },

  async updateTimer(cid: string, model: TimerValueUpdateModel) {
    return api.post<'stopTimer'>(TasksEndpointPaths.UPDATE_TIMER(cid), model);
  },
};
