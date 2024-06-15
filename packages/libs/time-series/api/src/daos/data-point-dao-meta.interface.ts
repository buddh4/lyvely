import { DataPoint, TimeSeriesContent } from '../schemas';
import type { Type } from '@nestjs/common';
import type { IDaoMetadata } from '@lyvely/api';

export interface IDataPointDaoMeta<T extends DataPoint = DataPoint> extends IDaoMetadata<T> {
  content: Type<TimeSeriesContent>;
}
