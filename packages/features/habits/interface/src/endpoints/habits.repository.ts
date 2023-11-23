import { UpdateHabitModel, UpdateHabitDataPointModel, CreateHabitModel } from '../models';
import { ENDPOINT_HABITS, HabitEndpointPaths, IHabitsEndpointClient } from './habits.endpoint';
import { TimerUpdateModel } from '@lyvely/timers-interface';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-web';
import { useApi } from '@lyvely/interface';

const api = useApi<IHabitsEndpointClient>(ENDPOINT_HABITS);

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return api.get<'getByFilter'>(ENDPOINT_HABITS, {
      params: filter,
    });
  },

  async create(habit: CreateHabitModel) {
    return api.post<'create'>(habit);
  },

  async update(cid: string, habit: Partial<UpdateHabitModel>) {
    return api.put<'update'>(cid, habit);
  },

  async updateDataPoint(habitId: string, model: UpdateHabitDataPointModel) {
    return api.post<'updateDataPoint'>(HabitEndpointPaths.UPDATE_DATA_POINT(habitId), model);
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return api.post<'sort'>(HabitEndpointPaths.SORT(cid), moveAction);
  },

  async startTimer(cid: string, model: TimerUpdateModel) {
    return api.post<'startTimer'>(HabitEndpointPaths.START_TIMER(cid), model);
  },

  async stopTimer(cid: string, model: TimerUpdateModel) {
    return api.post<'stopTimer'>(HabitEndpointPaths.STOP_TIMER(cid), model);
  },
};
