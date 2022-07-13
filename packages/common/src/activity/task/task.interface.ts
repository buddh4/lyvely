import { ActivityType, IActivity } from '../interfaces';

export interface UserDone {
  uid: any,
  tid: string,
  date: Date
}

export interface ITaskWithUsers extends IActivity {
  doneBy?: UserDone[];
}

export interface ITask extends IActivity {
  done?: string;
}

export function isTask(activity: IActivity): activity is ITask {
  return activity.type === ActivityType.Task;
}
