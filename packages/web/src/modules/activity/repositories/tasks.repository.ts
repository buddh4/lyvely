import repository from "@/repository";
import { UpdateTaskStateModel, UpdateTaskDto, ITask, UpdateTaskStateResultDto , CalendarDate, formatDate , EditTaskResponseDto } from '@lyvely/common';

const resource = "tasks";

export default {
  async create(activitiy: UpdateTaskDto) {
    return repository.post<EditTaskResponseDto>(`${resource}`, activitiy);
  },

  async setDone(task: ITask, date: CalendarDate) {
    return repository.post<UpdateTaskStateResultDto>(
      `${resource}/${task.id}/done`,
      new UpdateTaskStateModel({
        date: formatDate(date)
      })
    );
  },

  async setUndone(task: ITask, date: CalendarDate) {
    return repository.post<UpdateTaskStateResultDto>(
      `${resource}/${task.id}/undone`,
      new UpdateTaskStateModel({
        date: formatDate(date)
      })
    );
  },

  async update(taskId: string, model: Partial<UpdateTaskDto>) {
    return repository.post<EditTaskResponseDto>(`${resource}/${taskId}`, model);
  }
};
