import repository from "@/repository";
import { EditHabitDto, IHabit, UpdateDataPointDto, UpdateDataPointResultDto, EditHabitResponseDto } from '@lyvely/common';

const resource = "habits";

export default {
  async create(activitiy: EditHabitDto) {
    return repository.post<EditHabitResponseDto>(`${resource}`, activitiy);
  },

  async update(habitId: string, activitiy: EditHabitDto) {
    return repository.post<EditHabitResponseDto>(`${resource}/${habitId}`, activitiy);
  },

  async updateDataPoint(habitId: string, dto: UpdateDataPointDto) {
    return repository.post<UpdateDataPointResultDto>(`${resource}/${habitId}/update-log`, dto, { params: { cid: habitId } });
  }
};
