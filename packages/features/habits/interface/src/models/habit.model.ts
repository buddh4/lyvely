import { Expose } from 'class-transformer';
import { UpdateHabitModel } from './update-habit.model';
import { IEditableModel, UserAssignmentStrategy } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import {
  DataPointInputType,
  DataPointValueType,
  TimeSeriesContentModel,
  useDataPointStrategyFacade,
} from '@lyvely/time-series-interface';
import { IHabitConfig } from '../interfaces';

@Expose()
export class HabitModel<TID = string>
  extends TimeSeriesContentModel<TID, HabitModel<TID>, IHabitConfig>
  implements IEditableModel<UpdateHabitModel>
{
  static contentType = 'Habit';
  type = HabitModel.contentType;

  getDefaultConfig(): IHabitConfig {
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
