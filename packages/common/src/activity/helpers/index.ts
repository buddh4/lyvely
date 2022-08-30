import { ActivityType, IActivity } from '../interfaces';
import { CreateHabitDto, UpdateHabitDto } from '../habit';
import { CreateTaskDto, UpdateTaskDto } from '../task';

export function getEditModelByActivity(activity: IActivity) {
    return activity.type === ActivityType.Task
      ? new UpdateTaskDto(activity)
      : new UpdateHabitDto(activity);
}

export function getCreateModelByActivityType(type: ActivityType) {
    return type === ActivityType.Task
      ? new CreateTaskDto()
      : new CreateHabitDto();
}
