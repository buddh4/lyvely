import { NumberDataPoint } from '../schemas';
import { DataPointDao } from './data-point.dao';

export abstract class NumberDataPointDao<T extends NumberDataPoint> extends DataPointDao<T> {}
