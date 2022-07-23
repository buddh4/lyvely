import { ActivityType, IActivity } from '../../interfaces';
import { IContent } from "../../../content";

export interface IHabit extends IActivity {}

export function isHabit(content: IContent): content is IHabit {
  return content.type === ActivityType.Habit;
}
