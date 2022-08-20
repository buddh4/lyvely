import { ActivityType, IActivity } from '../../interfaces';
import { IContent } from "../../../content";

export type IHabit<TID = any> = IActivity<TID>;

export function isHabit(content: IContent): content is IHabit {
  return content && content.type === ActivityType.Habit;
}
