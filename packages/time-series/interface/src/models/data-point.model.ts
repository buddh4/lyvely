import { CalendarInterval } from '@lyvely/dates';
import { DocumentModel, TransformObjectId } from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
import { IDataPoint } from '../interfaces';

@Exclude()
export class DataPointModel<TID = string, T extends DataPointModel<TID> = any>
  extends DocumentModel<T>
  implements IDataPoint
{
  @Expose()
  @TransformObjectId()
  cid: TID;

  @Expose()
  @TransformObjectId()
  uid?: TID | null;

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
