import { CalendarDateTime, CalendarIntervalEnum } from "../../calendar";
import { DocumentModel } from "../../model";
import { Exclude, Expose } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';


@Exclude()
export abstract class DataPointModel<E extends DataPointModel = any> extends DocumentModel<E> {
  @Expose()
  @IsMongoId()
  cid: string|TObjectId;

  @Expose()
  @IsMongoId()
  @IsOptional()
  uid?: string|TObjectId;

  @Expose()
  date: Date;

  @Expose()
  interval: CalendarIntervalEnum;

  @Expose()
  @IsMongoId()
  tid: string;
}

export class NumberDataPointModel extends DataPointModel<NumberDataPointModel> {
  @Expose()
  value: number;

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

export class DataPointIntervalFilter {
    constructor(public search: CalendarDateTime, public level: CalendarIntervalEnum = CalendarIntervalEnum.Unscheduled) {}
}
