import { CalendarInterval, formatDate, REGEX_DATE_FORMAT } from '@/calendar';
import type { CalendarDate } from '@/calendar';
import { DocumentModel } from '@/models';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum, IsString, Matches } from 'class-validator';
import { TransformObjectId } from '@/utils';
import { IDataPoint } from '../interfaces';

@Exclude()
export class DataPointModel<E extends DataPointModel = any>
  extends DocumentModel<E>
  implements IDataPoint
{
  @Expose()
  @TransformObjectId()
  cid: string | TObjectId;

  @Expose()
  @TransformObjectId()
  uid?: string | TObjectId;

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

@Exclude()
export class DataPointIntervalFilter {
  @Expose()
  @IsString()
  @Matches(REGEX_DATE_FORMAT)
  public date: string;

  @Expose()
  @IsEnum(CalendarInterval)
  @Transform((value) => parseInt(value.value, 10), { toClassOnly: true }) // for query to class transformation
  public level: CalendarInterval;

  constructor(date: CalendarDate, level: CalendarInterval = CalendarInterval.Unscheduled) {
    this.date = formatDate(date);
    this.level = level;
  }
}
