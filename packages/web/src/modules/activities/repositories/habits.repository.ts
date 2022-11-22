import repository from '@/repository';
import {
  UpdateHabitDto,
  UpdateDataPointDto,
  CreateHabitDto,
  EndpointResult,
  IHabitsEndpointService,
  TimerUpdate,
} from '@lyvely/common';

const resource = 'habits';

export default {
  async create(activitiy: CreateHabitDto) {
    type a = EndpointResult<IHabitsEndpointService['create']>;
    return repository.post<EndpointResult<IHabitsEndpointService['create']>>(`${resource}`, activitiy);
  },

  async update(habitId: string, activitiy: Partial<UpdateHabitDto>) {
    return repository.put<EndpointResult<IHabitsEndpointService['update']>>(`${resource}/${habitId}`, activitiy);
  },

  async updateDataPoint(habitId: string, dto: UpdateDataPointDto) {
    return repository.post<EndpointResult<IHabitsEndpointService['updateDataPoint']>>(
      `${resource}/${habitId}/update-data-point`,
      dto,
    );
  },

  async startTimer(habitId: string, dto: TimerUpdate) {
    return repository.post<EndpointResult<IHabitsEndpointService['startTimer']>>(
      `${resource}/${habitId}/start-timer`,
      dto,
    );
  },

  async stopTimer(habitId: string, dto: TimerUpdate) {
    return repository.post<EndpointResult<IHabitsEndpointService['stopTimer']>>(
      `${resource}/${habitId}/stop-timer`,
      dto,
    );
  },
};
