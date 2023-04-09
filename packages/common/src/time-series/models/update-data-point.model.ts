import { Exclude, Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import { REGEX_DATE_FORMAT } from '@/calendar';
import { BaseModel } from '@/models';
import { IUpdateDataPoint } from '../interfaces';

@Exclude()
export class UpdateDataPointModel
  extends BaseModel<UpdateDataPointModel>
  implements IUpdateDataPoint
{
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  @Expose()
  value: any;
}
