import { TimeSeriesContent } from '@/time-series/content';
import { DataPoint } from '../schemas';
import { FieldValidationException } from '@lyvely/common';
import { UpdateQuerySet } from '@/core';
import { User } from '@/users';

export interface IDataPointProcessorStrategy<
  TModel extends TimeSeriesContent = TimeSeriesContent,
  TDataPoint extends DataPoint = DataPoint,
> {
  postProcess(user: User, model: TModel, dataPoint: TDataPoint): UpdateQuerySet<TDataPoint> | false;
}

export class InvalidDataPointValueTypeException extends FieldValidationException {
  constructor(error?: string) {
    error ||= 'isValid';
    super([{ property: 'valueType', errors: [error] }]);
  }
}
