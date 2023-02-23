import { DataPointService } from './data-point.service';
import { TextDataPoint, TextTimeSeriesContent } from '../schemas';

export abstract class TextDataPointService<
  TimeSeriesModel extends TextTimeSeriesContent = TextTimeSeriesContent,
  DataPointModel extends TextDataPoint = TextDataPoint,
> extends DataPointService<TimeSeriesModel, DataPointModel, string> {}
