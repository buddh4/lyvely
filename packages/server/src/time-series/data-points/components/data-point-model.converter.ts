import { useDataPointValueStrategyRegistry } from '../strategies';
import { DataPoint } from '../schemas';
import { DataPointModel } from '@lyvely/common';

export class DataPointModelConverter {
  static toModel<TModel extends DataPointModel = DataPointModel>(dataPoint: DataPoint) {
    const strategy = useDataPointValueStrategyRegistry().getStrategy(dataPoint.valueType);
    return strategy?.createModel(dataPoint) as TModel;
  }
}
