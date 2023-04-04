import { Expose } from 'class-transformer';
import { ContentModel } from '@/content';
import { UpdateHabitModel } from './update-habit.model';
import { IEditableModel } from '@/models';
import { CalendarIntervalEnum } from '@/calendar';
import { DataPointInputType, DataPointValueType, TimeSeriesContentModel } from '@/time-series';
import { UserAssignmentStrategy } from '@/collab';
import { IHabitConfig } from '../interfaces';

@Expose()
export class HabitModel
  extends TimeSeriesContentModel<HabitModel, IHabitConfig>
  implements IEditableModel<UpdateHabitModel>
{
  static contentType = 'Habit';
  type = HabitModel.contentType;

  getDefaultConfig(): IHabitConfig {
    return {
      score: 0,
      timeSeries: {
        interval: CalendarIntervalEnum.Daily,
        inputType: DataPointInputType.Checkbox,
        valueType: DataPointValueType.Number,
        userStrategy: UserAssignmentStrategy.Shared,
        history: [],
      },
    };
  }

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
  return content && content.type === HabitModel.contentType;
}
