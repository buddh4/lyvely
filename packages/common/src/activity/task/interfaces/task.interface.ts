import { ActivityType, IActivity } from '../../interfaces';
import { IContent } from "../../../content";

export interface UserDone {
  uid: any,
  tid: string,
  date: Date
}

export interface ITaskWithUsers extends IActivity {
  doneBy?: UserDone[];
}

export interface ITask<TID = any> extends IActivity<TID> {
  done?: string;
}

export function isTask(content: IContent): content is ITask {
  return content.type === ActivityType.Task;
}
