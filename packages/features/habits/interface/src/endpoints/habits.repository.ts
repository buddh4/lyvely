import { UpdateHabitModel, UpdateHabitDataPointModel, CreateHabitModel } from '../models';
import { ENDPOINT_HABITS, HabitsEndpointPaths, IHabitsEndpointClient } from './habits.endpoint';
import { TimerUpdateModel } from '@lyvely/timers-interface';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-web';
import { useApi, IProfileApiRequestOptions } from '@lyvely/interface';

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
    options?: IProfileApiRequestOptions,
  ) {
    return api.post<'updateDataPoint'>(
      HabitsEndpointPaths.UPDATE_DATA_POINT(habitId),
      model,
      options,
    );
  },

  async sort(cid: string, moveAction: CalendarPlanSort, options?: IProfileApiRequestOptions) {
    return api.post<'sort'>(HabitsEndpointPaths.SORT(cid), moveAction, options);
  },

  async startTimer(cid: string, model: TimerUpdateModel, options?: IProfileApiRequestOptions) {
    return api.post<'startTimer'>(HabitsEndpointPaths.START_TIMER(cid), model, options);
  },

  async stopTimer(cid: string, model: TimerUpdateModel, options?: IProfileApiRequestOptions) {
    return api.post<'stopTimer'>(HabitsEndpointPaths.STOP_TIMER(cid), model, options);
  },
};
