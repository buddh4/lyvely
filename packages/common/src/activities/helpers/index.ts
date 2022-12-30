import { ActivityType, ActivityModel } from '../models';
import { CreateHabitModel, HabitModel, isHabit, UpdateHabitModel } from '../habits';
import { CreateTaskModel, isTask, TaskModel, UpdateTaskModel } from '../tasks';

export function getEditModelByActivity(
  activity: ActivityModel,
): UpdateHabitModel | UpdateTaskModel {
  if (isTask(activity)) {
    return activity.getEditDto();
  } else if (isHabit(activity)) {
    return activity.getEditDto();
  }
}

export function getCreateModelByActivityType(
  type: ActivityType,
): CreateHabitModel | CreateTaskModel {
  return type === ActivityType.Task ? TaskModel.getCreateDto() : HabitModel.getCreateDto();
}
