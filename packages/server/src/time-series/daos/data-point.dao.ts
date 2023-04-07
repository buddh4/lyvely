import { DataPointStrategyDao } from './data-point-strategy.dao';
import { DataPoint } from '../schemas';
import { IntegrityException } from '@lyvely/common';
import { DataPointSchemaFactory } from '@/time-series/schemas/data-points/data-point-schema.factory';

export abstract class DataPointDao extends DataPointStrategyDao<DataPoint> {
  getModelConstructor(model: Partial<DataPoint>) {
    const result = DataPointSchemaFactory.getModelType(model.valueType);

    if (!result) throw new IntegrityException('Unknown data point value type: ' + model.valueType);

    return result;
  }
}
