import { ActivityType, IActivity } from '../interfaces';
import { EditHabitDto } from '../habit';
import { EditTaskDto } from '../task';

export function getEditModelByActivity(activity: IActivity) {
    return activity.type === ActivityType.Task
      ? new EditTaskDto(activity)
      : new EditHabitDto(activity);
}

export function getCreateModelByActivityType(type: ActivityType) {
    return type === ActivityType.Task
      ? new EditTaskDto()
      : new EditHabitDto();
}