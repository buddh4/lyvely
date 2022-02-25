import repository from "@/repository";
import { UpdateTaskStateModel, EditTaskModel, ITask, DoneTaskResultModel } from 'lyvely-common';
import { CalendarDate, formatDate } from "lyvely-common";

const resource = "tasks";

export default {
  async create(activitiy: EditTaskModel) {
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

  async update(model: EditTaskModel) {
    return repository.post<ITask>(`${resource}/${model.id}`, model);
  }
};
