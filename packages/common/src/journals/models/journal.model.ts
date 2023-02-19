import { Expose } from 'class-transformer';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  ITextDataPointConfig,
  TimeSeriesContentModel,
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

  getEditDto() {
    return undefined;
  }

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
      interval: this.timeSeriesConfig.interval,
      userStrategy: this.timeSeriesConfig.userStrategy,
      inputType: this.timeSeriesConfig.inputType,
    });

    if (this.timeSeriesConfig.valueType === DataPointValueType.Number) {
      const numberConfig = <INumberDataPointConfig>this.timeSeriesConfig;
      editModel.min = this.timeSeriesConfig.min;
      editModel.max = this.timeSeriesConfig.max;
      editModel.optimal = this.timeSeriesConfig.optimal;
    } else if (this.timeSeriesConfig.valueType === DataPointValueType.Text) {
      const textConfig = <ITextDataPointConfig>this.timeSeriesConfig;
      editModel.required = textConfig.required;
    }

    return editModel;
  }
}
