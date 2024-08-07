import { UpdateHabitModel, UpdateHabitDataPointModel, CreateHabitModel } from '../models';
import { ENDPOINT_HABITS, HabitsEndpoints, IHabitsEndpointClient } from './habits.endpoint';
import { TimerUpdateModel, useApi, IProfileApiRequestOptions } from '@lyvely/interface';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IHabitsEndpointClient>(ENDPOINT_HABITS);

export default {
  async getByFilter(filter: CalendarPlanFilter, options?: IProfileApiRequestOptions) {
    return api.get<'getByFilter'>({
      ...options,
      params: filter,
    });
  },

  async create(habit: CreateHabitModel, options?: IProfileApiRequestOptions) {
    return api.post<'create'>(habit, {}, options);
  },

  async update(cid: string, habit: Partial<UpdateHabitModel>, options?: IProfileApiRequestOptions) {
    return api.put<'update'>(cid, habit, options);
  },

  async updateDataPoint(
    habitId: string,
    model: UpdateHabitDataPointModel,
    options?: IProfileApiRequestOptions
  ) {
    return api.post<'updateDataPoint'>(HabitsEndpoints.UPDATE_DATA_POINT(habitId), model, options);
  },

  async sort(cid: string, moveAction: CalendarPlanSort, options?: IProfileApiRequestOptions) {
    return api.post<'sort'>(HabitsEndpoints.SORT(cid), moveAction, options);
  },

  async startTimer(cid: string, model: TimerUpdateModel, options?: IProfileApiRequestOptions) {
    return api.post<'startTimer'>(HabitsEndpoints.START_TIMER(cid), model, options);
  },

  async stopTimer(cid: string, model: TimerUpdateModel, options?: IProfileApiRequestOptions) {
    return api.post<'stopTimer'>(HabitsEndpoints.STOP_TIMER(cid), model, options);
  },
};
