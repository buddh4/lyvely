import repository from "@/repository";
import { UpdateTaskStateModel, EditTaskDto, ITask, DoneTaskResultModel , CalendarDate, formatDate , EditTaskResponseDto } from '@lyvely/common';

const resource = "tasks";

export default {
  async create(activitiy: EditTaskDto) {
    return repository.post<ITask>(`${resource}`, activitiy);
  },

  async setDone(task: ITask, date: CalendarDate) {
    return repository.post<DoneTaskResultModel>(
      `${resource}/${task.id}/done`,
      new UpdateTaskStateModel({
        date: formatDate(date)
      })
    );
  },

  async setUndone(task: ITask, date: CalendarDate) {
    return repository.post<DoneTaskResultModel>(
      `${resource}/${task.id}/undone`,
      new UpdateTaskStateModel({
        date: formatDate(date)
      })
    );
  },

  async update(taskId: string, model: EditTaskDto) {
    return repository.post<EditTaskResponseDto>(`${resource}/${taskId}`, model);
  }
};
