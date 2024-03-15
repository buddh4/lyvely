import { Exclude, Expose } from 'class-transformer';
import { UpdateHabitModel } from './update-habit.model';
import { ContentModel, IEditableModel, UserAssignmentStrategy } from '@lyvely/interface';
import { CalendarInterval } from '@lyvely/dates';
import {
  DataPointInputType,
  DataPointValueType,
  TimeSeriesContentModel,
  useDataPointStrategyFacade,
} from '@lyvely/time-series-interface';
import { IHabitConfig } from '../interfaces';

@Exclude()
export class HabitModel<TID = string>
  extends TimeSeriesContentModel<TID, IHabitConfig>
  implements IEditableModel<UpdateHabitModel>, ContentModel<TID, IHabitConfig>
{
  static contentType = 'Habit';

  @Expose()
  override type = HabitModel.contentType;

  override getDefaultConfig(): IHabitConfig {
    return {
      score: 0,
      timeSeries: {
        interval: CalendarInterval.Daily,
        inputType: DataPointInputType.Checkbox,
        valueType: DataPointValueType.Number,
        userStrategy: UserAssignmentStrategy.Shared,
        history: [],
      },
    };
  }

  toEditModel() {
    const editModel = new UpdateHabitModel({
      title: this.content.title,
      text: this.content.text,
      score: this.config.score,
    });

    useDataPointStrategyFacade().populateDataPointConfig(editModel, this.timeSeriesConfig);
    return editModel;
  }
}
