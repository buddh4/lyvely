import { DataPoint } from '../schemas';
import { DataPointModel, useDataPointStrategyFacade } from '@lyvely/common';

export class DataPointModelConverter {
  static toModel<TModel extends DataPointModel = DataPointModel>(dataPoint: DataPoint): TModel {
    return <TModel>useDataPointStrategyFacade().createDataPoint(dataPoint);
  }
}
