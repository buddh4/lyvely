import { DataPoint } from '../schemas';
import { DataPointModel, useDataPointStrategyFacade } from '@lyvely/time-series-interface';

export class DataPointModelConverter {
  static toModel<TModel extends DataPointModel = DataPointModel>(dataPoint: DataPoint): TModel {
    return <TModel>useDataPointStrategyFacade().createDataPoint(dataPoint);
  }
}
