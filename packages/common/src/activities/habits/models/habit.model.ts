import { Expose } from 'class-transformer';
import { ActivityType, ActivityModel } from '../../models';
import { IsEnum } from 'class-validator';
import { ContentModel } from '@/content';
import { CreateHabitDto, UpdateHabitDto } from '@/activities';

@Expose()
export class HabitModel extends ActivityModel<HabitModel> {
  @IsEnum(ActivityType)
  type: string = ActivityType.Habit;

  static getCreateDto() {
    return new CreateHabitDto();
  }

  getEditDto() {
    return new UpdateHabitDto({
      title: this.content.title,
      text: this.content.text,
      interval: this.timeSeriesConfig.interval,
      userStrategy: this.timeSeriesConfig.userStrategy,
      score: this.config.score,
    });
  }
}

export function isHabit(content: ContentModel): content is HabitModel {
  return content && content.type === ActivityType.Habit;
}
