import { CalendarInterval } from '@lyvely/dates';
import { type BaseModelData, BaseModel, TransformObjectId } from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
import { IDataPoint } from '../interfaces';

@Exclude()
export class DataPointModel<TID = string> implements IDataPoint {
  @Expose()
  id: string;

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

  constructor(data: BaseModelData<DataPointModel<any>>) {
    BaseModel.init(this, data);
  }
}
