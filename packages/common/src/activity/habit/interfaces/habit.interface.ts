import { ActivityType, IActivity } from '../../interfaces';

export interface IHabit extends IActivity {}

export function isHabit(activity: IActivity): activity is IHabit {
  return activity.type === ActivityType.Habit;
}