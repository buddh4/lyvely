import { Expose } from 'class-transformer';
import { ActivityType, ActivityModel } from '../../models';
import { IsEnum } from 'class-validator';
import { ContentModel } from '@/content';

@Expose()
export class HabitModel extends ActivityModel<HabitModel> {
  @IsEnum(ActivityType)
  type: string = ActivityType.Habit;
}

export function isHabit(content: ContentModel): content is HabitModel {
  return content && content.type === ActivityType.Habit;
}
