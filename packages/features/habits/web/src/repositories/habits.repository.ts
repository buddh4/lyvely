import {
  UpdateHabitModel,
  UpdateHabitDataPointModel,
  CreateHabitModel,
  IHabitsEndpointService,
  ENDPOINT_HABITS,
} from '@lyvely/habits-interface';
import { TimerUpdateModel } from '@lyvely/timers-interface';
import { EndpointResult } from '@lyvely/common';
import { CalendarPlanSort, CalendarPlanFilter } from '@lyvely/calendar-plan-web';
import { useApiRepository } from '@lyvely/interface';

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return useApiRepository().get<EndpointResult<IHabitsEndpointService['getByFilter']>>(
      ENDPOINT_HABITS,
      {
        params: filter,
      },
    );
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return useApiRepository().post<EndpointResult<IHabitsEndpointService['sort']>>(
      `${ENDPOINT_HABITS}/${cid}/sort`,
      moveAction,
    );
  },

  async create(habit: CreateHabitModel) {
    return useApiRepository().post<EndpointResult<IHabitsEndpointService['create']>>(
      `${ENDPOINT_HABITS}`,
      habit,
    );
  },

  async update(habitId: string, habit: Partial<UpdateHabitModel>) {
    return useApiRepository().put<EndpointResult<IHabitsEndpointService['update']>>(
      `${ENDPOINT_HABITS}/${habitId}`,
      habit,
    );
  },

  async updateDataPoint(habitId: string, model: UpdateHabitDataPointModel) {
    return useApiRepository().post<EndpointResult<IHabitsEndpointService['updateDataPoint']>>(
      `${ENDPOINT_HABITS}/${habitId}/update-data-point`,
      model,
    );
  },

  async startTimer(habitId: string, model: TimerUpdateModel) {
    return useApiRepository().post<EndpointResult<IHabitsEndpointService['startTimer']>>(
      `${ENDPOINT_HABITS}/${habitId}/start-timer`,
      model,
    );
  },

  async stopTimer(habitId: string, model: TimerUpdateModel) {
    return useApiRepository().post<EndpointResult<IHabitsEndpointService['stopTimer']>>(
      `${ENDPOINT_HABITS}/${habitId}/stop-timer`,
      model,
    );
  },
};
