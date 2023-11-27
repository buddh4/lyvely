import { Expose } from 'class-transformer';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  ISelectionDataPointConfig,
  ITextDataPointConfig,
  TimeSeriesContentModel,
  useDataPointStrategyFacade,
} from '@lyvely/time-series-interface';
import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy, IEditableModel } from '@lyvely/interface';
import { UpdateJournalModel } from './update-journal.model';

export interface IJournalConfig {
  timeSeries: INumberDataPointConfig | ITextDataPointConfig | ISelectionDataPointConfig;
}

@Expose()
export class JournalModel<TID = string>
  extends TimeSeriesContentModel<TID, JournalModel<TID>, IJournalConfig>
  implements IEditableModel<UpdateJournalModel>
{
  static contentType = 'Journal';
  type = JournalModel.contentType;

  getDefaultConfig(): IJournalConfig {
    return {
      timeSeries: {
        interval: CalendarInterval.Daily,
        inputType: DataPointInputType.Checkbox,
        valueType: DataPointValueType.Number,
        userStrategy: UserAssignmentStrategy.Shared,
        history: [],
      },
    };
  }

  toEditModel(): UpdateJournalModel {
    const editModel = new UpdateJournalModel({
      title: this.content.title,
      text: this.content.text,
    });
    useDataPointStrategyFacade().populateDataPointConfig(editModel, this.timeSeriesConfig);
    return editModel;
  }
}
