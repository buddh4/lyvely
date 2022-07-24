import repository from "@/repository";
import { EditHabitDto, IHabit, UpdateActivityLogModel, UpdateHabitResultDto } from 'lyvely-common';

const resource = "habits";

export default {
  async create(activitiy: EditHabitDto) {
    return repository.post<IHabit>(`${resource}`, activitiy);
  },

  async update(habitId: string, activitiy: EditHabitDto) {
    return repository.post<IHabit>(`${resource}/${habitId}`, activitiy);
  },

  async updateLog(habitId: string, dto: UpdateActivityLogModel) {
    return repository.post<UpdateHabitResultDto>(`${resource}/${habitId}/update-log`, dto, { params: { cid: habitId } });
  }
};
