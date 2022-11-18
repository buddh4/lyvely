import { ActivityType, ActivityModel } from '../models';
import { CreateHabitDto, UpdateHabitDto } from '../habits';
import { CreateTaskDto, UpdateTaskDto } from '../tasks';

export function getEditModelByActivity(activity: ActivityModel) {
  return activity.type === ActivityType.Task ? new UpdateTaskDto(activity) : new UpdateHabitDto(activity);
}

export function getCreateModelByActivityType(type: ActivityType) {
  return type === ActivityType.Task ? new CreateTaskDto() : new CreateHabitDto();
}
