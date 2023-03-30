import { TextDataPoint } from '../schemas';
import { DataPointDao } from './data-point.dao';

export abstract class TextDataPointDao<T extends TextDataPoint> extends DataPointDao<T> {}
