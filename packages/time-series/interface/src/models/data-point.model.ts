import { CalendarInterval } from '@lyvely/dates';
import { DocumentModel } from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
import { TransformObjectId } from '@lyvely/common';
import { IDataPoint } from '../interfaces';

@Exclude()
export class DataPointModel<E extends DataPointModel = any>
  extends DocumentModel<E>
  implements IDataPoint
{
  @Expose()
  @TransformObjectId()
  cid: any;

  @Expose()
  @TransformObjectId()
  uid?: any;

  @Expose()
  date: Date;

  @Expose()
  interval: CalendarInterval;

  @Expose()
  tid: string;

  @Expose()
  valueType: string;

  @Expose()
  value: any;
}
