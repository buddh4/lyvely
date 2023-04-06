import { DataPointStrategyDao } from './data-point-strategy.dao';
import {
  DataPoint,
  TextDataPoint,
  NumberDataPoint,
  SelectionDataPoint,
  TimerDataPoint,
} from '../schemas';
import { DataPointValueType, IntegrityException } from '@lyvely/common';

export abstract class DataPointDao extends DataPointStrategyDao<DataPoint> {
  getModelConstructor(model: Partial<DataPoint>) {
    switch (model.valueType) {
      case DataPointValueType.Text:
        return TextDataPoint;
      case DataPointValueType.Number:
        return NumberDataPoint;
      case DataPointValueType.Selection:
        return SelectionDataPoint;
      case DataPointValueType.Timer:
        return TimerDataPoint;
    }

    throw new IntegrityException('Unknown data point value type: ' + model.valueType);
  }
}
