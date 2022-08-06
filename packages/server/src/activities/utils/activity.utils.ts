import { ActivityType, IContent } from "@lyvely/common";
import { Content } from "../../content";
import { Habit } from "../schemas";

export function isHabitContent(content: IContent): content is Habit {
  return content && content.type === ActivityType.Habit && content instanceof Content;
}
