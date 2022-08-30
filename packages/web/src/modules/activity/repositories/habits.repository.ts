import repository from "@/repository";
import { UpdateHabitDto, IHabit, UpdateDataPointDto, UpdateDataPointResultDto, EditHabitResponseDto } from '@lyvely/common';

const resource = "habits";

export default {
  async create(activitiy: UpdateHabitDto) {
    return repository.post<EditHabitResponseDto>(`${resource}`, activitiy);
  },

  async update(habitId: string, activitiy: Partial<UpdateHabitDto>) {
    return repository.put<EditHabitResponseDto>(`${resource}/${habitId}`, activitiy);
  },

  async updateDataPoint(habitId: string, dto: UpdateDataPointDto) {
    return repository.post<UpdateDataPointResultDto>(`${resource}/${habitId}/update-log`, dto, { params: { cid: habitId } });
  }
};
