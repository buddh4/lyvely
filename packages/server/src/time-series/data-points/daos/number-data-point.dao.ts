import { NumberDataPoint } from '../schemas';
import { DataPointStrategyDao } from './data-point-strategy.dao';

export abstract class NumberDataPointDao<
  T extends NumberDataPoint = NumberDataPoint,
> extends DataPointStrategyDao<T> {}
