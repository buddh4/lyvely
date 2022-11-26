import { ActivityType, ActivityModel } from '../models';
import { CreateHabitDto, HabitModel, isHabit, UpdateHabitDto } from '../habits';
import { CreateTaskDto, isTask, TaskModel, UpdateTaskDto } from '../tasks';

export function getEditModelByActivity(activity: ActivityModel): UpdateHabitDto | UpdateTaskDto {
  if (isTask(activity)) {
    return activity.getEditDto();
  } else if (isHabit(activity)) {
    return activity.getEditDto();
  }
}

export function getCreateModelByActivityType(type: ActivityType): CreateHabitDto | CreateTaskDto {
  return type === ActivityType.Task ? TaskModel.getCreateDto() : HabitModel.getCreateDto();
}
