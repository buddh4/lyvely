import repository from '@/repository';
import {
  UpdateHabitModel,
  UpdateHabitDataPointModel,
  CreateHabitModel,
  EndpointResult,
  IHabitsEndpointService,
  TimerUpdateModel,
} from '@lyvely/common';

const resource = 'habits';

export default {
  async create(activitiy: CreateHabitModel) {
    return repository.post<EndpointResult<IHabitsEndpointService['create']>>(
      `${resource}`,
      activitiy,
    );
  },

  async update(habitId: string, activitiy: Partial<UpdateHabitModel>) {
    return repository.put<EndpointResult<IHabitsEndpointService['update']>>(
      `${resource}/${habitId}`,
      activitiy,
    );
  },

  async updateDataPoint(habitId: string, dto: UpdateHabitDataPointModel) {
    return repository.post<EndpointResult<IHabitsEndpointService['updateDataPoint']>>(
      `${resource}/${habitId}/update-data-point`,
      dto,
    );
  },

  async startTimer(habitId: string, dto: TimerUpdateModel) {
    return repository.post<EndpointResult<IHabitsEndpointService['startTimer']>>(
      `${resource}/${habitId}/start-timer`,
      dto,
    );
  },

  async stopTimer(habitId: string, dto: TimerUpdateModel) {
    return repository.post<EndpointResult<IHabitsEndpointService['stopTimer']>>(
      `${resource}/${habitId}/stop-timer`,
      dto,
    );
  },
};
