import { DataPointStrategyDao } from './data-point-strategy.dao';
import { DataPoint } from '../schemas';
import { IntegrityException, LeanDoc } from '@lyvely/api';
import { DataPointSchemaFactory } from '../schemas/data-points/data-point-schema.factory';
import type { Type } from '@nestjs/common';

export abstract class DataPointDao<
  T extends DataPoint = DataPoint,
> extends DataPointStrategyDao<T> {
  getModelConstructor(model: LeanDoc<T>) {
    const result = DataPointSchemaFactory.getModelType(model.valueType!) as Type<T> | undefined;

    if (!result) throw new IntegrityException('Unknown data point value type: ' + model.valueType);

    return result;
  }
}
