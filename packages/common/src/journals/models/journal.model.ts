import { Expose } from 'class-transformer';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  ITextDataPointConfig,
  TimeSeriesContentModel,
  useDataPointStrategyFacade,
} from '@/time-series';
import { CalendarIntervalEnum } from '@/calendar';
import { UserAssignmentStrategy } from '@/collab';
import { IEditableModel } from '@/models';
import { UpdateJournalModel } from '@/journals';

export interface IJournalConfig {
  timeSeries: INumberDataPointConfig | ITextDataPointConfig;
}

@Expose()
export class JournalModel
  extends TimeSeriesContentModel<JournalModel, IJournalConfig>
  implements IEditableModel<UpdateJournalModel>
{
  static contentType = 'Journal';
  type = JournalModel.contentType;

  getDefaultConfig(): IJournalConfig {
    return {
      timeSeries: {
        interval: CalendarIntervalEnum.Daily,
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
