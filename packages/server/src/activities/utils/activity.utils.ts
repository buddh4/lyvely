import { ActivityType, IContent } from "@lyvely/common";
import { Content } from "../../content";
import { Habit, Task } from "../schemas";

export function isHabitContent(content: IContent): content is Habit {
  return content && content.type === ActivityType.Habit && content instanceof Content;
}

export function isTaskContent(content: IContent): content is Task {
  return content && content.type === ActivityType.Task && content instanceof Content;
}
