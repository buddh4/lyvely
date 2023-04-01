import { JournalModel } from './journal.model';
import {
  DataPointModel,
  DataPointValueType,
  NumberDataPointModel,
  TextDataPointModel,
  TimeSeriesDataPointStore,
} from '@/time-series';

export class JournalDataPointStore extends TimeSeriesDataPointStore<JournalModel> {
  createDataPoint(model: JournalModel, timingId: string): DataPointModel {
    // TODO: Use factory
    if (model.timeSeriesConfig.valueType === DataPointValueType.Number) {
      return new NumberDataPointModel({
        cid: model.id,
        interval: model.timeSeriesConfig.interval,
        tid: timingId,
      });
    } else if (model.timeSeriesConfig.valueType === DataPointValueType.Text) {
      return new TextDataPointModel({
        cid: model.id,
        interval: model.timeSeriesConfig.interval,
        tid: timingId,
      });
    }
  }
}
