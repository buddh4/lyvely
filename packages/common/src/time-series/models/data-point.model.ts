import { CalendarIntervalEnum, formatDate, REGEX_DATE_FORMAT, TimerModel } from '@/calendar';
import type { CalendarDate } from '@/calendar';
import { DocumentModel, PropertyType } from '@/models';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsString, Matches } from 'class-validator';

@Exclude()
export abstract class DataPointModel<E extends DataPointModel = any> extends DocumentModel<E> {
  @Expose()
  cid: string | TObjectId;

  @Expose()
  uid?: string | TObjectId;

  @Expose()
  date: Date;

  @Expose()
  interval: CalendarIntervalEnum;

  @Expose()
  tid: string;
}

export class NumberDataPointModel extends DataPointModel<NumberDataPointModel> {
  @Expose()
  value: number;

  @Expose()
  @Type(() => TimerModel)
  @PropertyType(TimerModel)
  timer?: TimerModel;

  afterInit() {
    this.value = this.value ?? 0;
  }
}

export class TextDataPointModel extends DataPointModel<TextDataPointModel> {
  @Expose()
  value: string;

  afterInit() {
    this.value = this.value ?? '';
  }
}

@Exclude()
export class DataPointIntervalFilter {
  @Expose()
  @IsString()
  @Matches(REGEX_DATE_FORMAT)
  public date: string;

  @Expose()
  @IsEnum(CalendarIntervalEnum)
  @Transform((value) => parseInt(value.value, 10), { toClassOnly: true }) // for query to class transformation
  public level: CalendarIntervalEnum;

  constructor(date: CalendarDate, level: CalendarIntervalEnum = CalendarIntervalEnum.Unscheduled) {
    this.date = formatDate(date);
    this.level = level;
  }
}
