import { Prop } from '@nestjs/mongoose';
import { ChartSeriesConfig, TimeSeriesChartType } from '@lyvely/analytics';
import { getStringEnumValues, BaseModel, StrictBaseModelData } from '@lyvely/common';
import { TObjectId, ObjectIdProp } from '@lyvely/api';
import { TimeSeriesValueChartConfigModel } from '@lyvely/time-series-interface';

export abstract class TimeSeriesValueChartSeriesConfig
  extends ChartSeriesConfig
  implements TimeSeriesValueChartConfigModel<TObjectId>
{
  abstract override readonly type: string;

  @ObjectIdProp({ required: true })
  cid: TObjectId;

  @Prop({ required: true, enum: getStringEnumValues(TimeSeriesChartType) })
  chartType: TimeSeriesChartType;

  @Prop({ required: true })
  color?: string;

  constructor(data?: Omit<StrictBaseModelData<TimeSeriesValueChartSeriesConfig>, 'type'>) {
    super(false);
    BaseModel.init(this, data);
  }
}
