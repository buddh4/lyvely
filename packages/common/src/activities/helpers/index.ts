import { ActivityType } from "../models";
import { CreateHabitDto, UpdateHabitDto } from '../habit';
import { CreateTaskDto, UpdateTaskDto } from '../task';
import { ActivityModel } from "../models";

export function getEditModelByActivity(activity: ActivityModel) {
    return activity.type === ActivityType.Task
      ? new UpdateTaskDto(activity)
      : new UpdateHabitDto(activity);
}

export function getCreateModelByActivityType(type: ActivityType) {
    return type === ActivityType.Task
      ? new CreateTaskDto()
      : new CreateHabitDto();
}