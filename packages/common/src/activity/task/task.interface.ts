import { ActivityType, IActivity } from '../interfaces';

export interface ITask extends IActivity {
  done?: string;
}

export function isTask(activity: IActivity): activity is ITask {
  return activity.type === ActivityType.Task;
}