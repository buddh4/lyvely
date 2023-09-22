import { Expose } from 'class-transformer';
import { UpdateHabitModel } from './update-habit.model';
import { IEditableModel } from '@lyvely/core';
import { CalendarInterval } from '@lyvely/dates';
import {
  DataPointInputType,
  DataPointValueType,
  TimeSeriesContentModel,
  useDataPointStrategyFacade,
} from '@/time-series';
import { UserAssignmentStrategy } from '@lyvely/collab';
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
