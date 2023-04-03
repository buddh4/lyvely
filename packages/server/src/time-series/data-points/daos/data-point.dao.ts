import { DataPointStrategyDao } from '../daos';
import { DataPoint, TextDataPoint, NumberDataPoint } from '../schemas';
import { DataPointValueType } from '@lyvely/common';
import { SelectionDataPoint } from '@/time-series/data-points/schemas/selection-data-point.schema';

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
