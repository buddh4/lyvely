import { CalendarInterval } from '@/calendar';
import { DocumentModel } from '@/models';
import { Exclude, Expose, Transform } from 'class-transformer';
import { TransformObjectId } from '@/utils';
import { IDataPoint } from '../interfaces';

@Exclude()
export class DataPointModel<E extends DataPointModel = any>
  extends DocumentModel<E>
  implements IDataPoint
{
  @Expose()
  @TransformObjectId()
  cid: TObjectId;

  @Expose()
  @TransformObjectId()
  uid?: TObjectId;

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
