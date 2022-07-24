import { Exclude, Expose } from 'class-transformer';
import { DocumentDto, ObjectId } from "../../model";
import { ITimeSeriesDataPoint, ITimeSeriesNumberDataPoint, ITimeSeriesTextDataPoint } from "../interfaces";
import { CalendarIntervalEnum } from "../../calendar";

@Exclude()
export abstract class DataPointDto<E> extends DocumentDto<E> implements ITimeSeriesDataPoint {
  @Expose()
  @ObjectId()
  cid: string;

  @Expose()
  date: Date;

  @Expose()
  interval: CalendarIntervalEnum;

  @Expose()
  @ObjectId()
  tid: string;

  @Expose()
  @ObjectId()
  uid: string;
}

export class NumberDataPointDto extends DataPointDto<NumberDataPointDto> implements ITimeSeriesNumberDataPoint {
  @Expose()
  value: number;

  afterInit() {
    this.value = this.value ?? 0;
  }
}

export class TextDataPointDto extends DataPointDto<TextDataPointDto> implements ITimeSeriesTextDataPoint {
  @Expose()
  value: string;

  afterInit() {
    this.value = this.value ?? '';
  }
}
