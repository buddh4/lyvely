import { Exclude, Expose } from 'class-transformer';
import { IsHexColor, IsMongoId, IsOptional } from 'class-validator';
import { TimeSeriesConfigModel } from '@lyvely/analytics-interface';
import { BaseModel } from '@lyvely/common';
import type { BaseModelData } from '@lyvely/common';

@Exclude()
export abstract class TimeSeriesValueChartConfigModel<TID = string> extends TimeSeriesConfigModel {
  @Expose()
  @IsMongoId()
  cid: TID;

  @Expose()
  @IsHexColor()
  @IsOptional()
  color?: string;

  abstract override readonly type: string;

  constructor(data?: BaseModelData<TimeSeriesValueChartConfigModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}
