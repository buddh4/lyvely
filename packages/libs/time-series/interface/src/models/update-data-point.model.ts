import { Exclude, Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import { REGEX_DATE_FORMAT } from '@lyvely/dates';
import { BaseModel, type PropertiesOf } from '@lyvely/common';
import { IUpdateDataPoint } from '../interfaces';

@Exclude()
export class UpdateDataPointModel implements IUpdateDataPoint {
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  @Expose()
  value: any;

  constructor(data: PropertiesOf<UpdateDataPointModel>) {
    BaseModel.init(this, data);
  }
}
