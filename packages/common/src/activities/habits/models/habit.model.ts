import { Expose } from 'class-transformer';
import { ActivityType, ActivityModel } from '../../models';
import { ContentModel } from '@/content';
import { UpdateHabitModel } from './update-habit.model';
import { IEditableModel } from '@/models';

@Expose()
export class HabitModel
  extends ActivityModel<HabitModel>
  implements IEditableModel<UpdateHabitModel>
{
  type = ActivityType.Habit;

  toEditModel() {
    return new UpdateHabitModel({
      title: this.content.title,
      text: this.content.text,
      interval: this.timeSeriesConfig.interval,
      userStrategy: this.timeSeriesConfig.userStrategy,
      min: this.timeSeriesConfig.min,
      max: this.timeSeriesConfig.max,
      optimal: this.timeSeriesConfig.optimal,
      inputType: this.timeSeriesConfig.inputType,
      score: this.config.score,
    });
  }
}

export function isHabit(content: ContentModel): content is HabitModel {
  return content && content.type === ActivityType.Habit;
}
