import { TimeSeriesContent } from '@/time-series/content';
import { DataPoint } from '../schemas';
import { DataPointModel, FieldValidationException } from '@lyvely/common';
import { UpdateQuerySet } from '@/core';
import { User } from '@/users';

export interface DataPointValueStrategy<
  TModel extends TimeSeriesContent = any,
  TDataPoint extends DataPoint = any,
  TValue = any,
> {
  prepareValue(model: TModel, dataPoint: TDataPoint, value: TValue): TValue;
  postProcess(user: User, model: TModel, dataPoint: TDataPoint): UpdateQuerySet<TDataPoint> | false;
  createModel(dataPoint: TDataPoint): DataPointModel;
}

export class InvalidDataPointValueTypeException extends FieldValidationException {
  constructor(error?: string) {
    error ||= 'isValid';
    super([{ property: 'valueType', errors: [error] }]);
  }
}
