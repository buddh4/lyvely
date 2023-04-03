import { TextDataPoint } from '../schemas';
import { DataPointStrategyDao } from './data-point-strategy.dao';

export abstract class TextDataPointDao<T extends TextDataPoint> extends DataPointStrategyDao<T> {}
