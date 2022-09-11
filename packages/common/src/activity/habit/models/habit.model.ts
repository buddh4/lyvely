import { Exclude, Expose } from 'class-transformer';
import { ActivityType } from "../../models";
import { IsEnum } from 'class-validator';
import { ContentModel } from "../../../content";
import { ActivityModel } from "../../models";

@Exclude()
export class HabitModel extends ActivityModel<HabitModel> {
  @Expose()
  @IsEnum(ActivityType)
  type: string = ActivityType.Habit;
}

export function isHabit(content: ContentModel): content is HabitModel {
  return content && content.type === ActivityType.Habit;
}
