import repository from '@/repository';
import {
  UpdateHabitModel,
  UpdateHabitDataPointModel,
  CreateHabitModel,
  EndpointResult,
  IHabitsEndpointService,
  TimerUpdateModel,
  CalendarPlanFilter,
  ENDPOINT_HABITS,
  CalendarPlanSort,
} from '@lyvely/common';

export default {
  async getByFilter(filter: CalendarPlanFilter) {
    return repository.get<EndpointResult<IHabitsEndpointService['getByFilter']>>(ENDPOINT_HABITS, {
      params: filter,
    });
  },

  async sort(cid: string, moveAction: CalendarPlanSort) {
    return repository.post<EndpointResult<IHabitsEndpointService['sort']>>(
      `${ENDPOINT_HABITS}/${cid}/sort`,
      moveAction,
    );
  },

  async create(activitiy: CreateHabitModel) {
    return repository.post<EndpointResult<IHabitsEndpointService['create']>>(
      `${ENDPOINT_HABITS}`,
      activitiy,
    );
  },

  async update(habitId: string, activitiy: Partial<UpdateHabitModel>) {
    return repository.put<EndpointResult<IHabitsEndpointService['update']>>(
      `${ENDPOINT_HABITS}/${habitId}`,
      activitiy,
    );
  },

  async updateDataPoint(habitId: string, dto: UpdateHabitDataPointModel) {
    return repository.post<EndpointResult<IHabitsEndpointService['updateDataPoint']>>(
      `${ENDPOINT_HABITS}/${habitId}/update-data-point`,
      dto,
    );
  },

  async startTimer(habitId: string, dto: TimerUpdateModel) {
    return repository.post<EndpointResult<IHabitsEndpointService['startTimer']>>(
      `${ENDPOINT_HABITS}/${habitId}/start-timer`,
      dto,
    );
  },

  async stopTimer(habitId: string, dto: TimerUpdateModel) {
    return repository.post<EndpointResult<IHabitsEndpointService['stopTimer']>>(
      `${ENDPOINT_HABITS}/${habitId}/stop-timer`,
      dto,
    );
  },
};
