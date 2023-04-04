import { DataPointStrategyDao } from './data-point-strategy.dao';
import { DataPoint, TextDataPoint, NumberDataPoint, SelectionDataPoint } from '../schemas';
import { DataPointValueType } from '@lyvely/common';

export abstract class DataPointDao extends DataPointStrategyDao<DataPoint> {
  getModelConstructor(model?: Partial<DataPoint>) {
    switch (model.valueType) {
      case DataPointValueType.Text:
        return TextDataPoint;
      case DataPointValueType.Number:
        return NumberDataPoint;
      case DataPointValueType.Selection:
        return SelectionDataPoint;
    }

    return DataPoint;
  }
}
