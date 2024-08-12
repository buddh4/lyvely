import { NestedSchema, ObjectIdArrayProp, TObjectId } from '@lyvely/api';
import { Prop } from '@nestjs/mongoose';
import {
  CHART_SERIES_USER_SCORE,
  TimeSeriesChartType,
  UserScoreSeriesConfigModel,
} from '@lyvely/analytics-interface';
import { ChartSeriesConfig } from './chart-series-config.schema';
import { BaseModel, getStringEnumValues, type StrictBaseModelData } from '@lyvely/common';
import { ChartSeriesSchemaFactory } from './chart-series-schema.factory';

@NestedSchema()
export class UserScoreChartSeriesConfig
  extends ChartSeriesConfig
  implements UserScoreSeriesConfigModel<TObjectId>
{
  override readonly type = CHART_SERIES_USER_SCORE.id;

  @Prop({ required: true, enum: getStringEnumValues(TimeSeriesChartType) })
  chartType: TimeSeriesChartType;

  @ObjectIdArrayProp()
  uids?: Array<TObjectId>;

  @ObjectIdArrayProp()
  tagIds?: Array<TObjectId>;

  @Prop()
  currentUser?: boolean;

  constructor(data?: Omit<StrictBaseModelData<UserScoreChartSeriesConfig>, 'type'>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const UserScoreChartSeriesConfigSchema = ChartSeriesSchemaFactory.createTimeSeriesForClass(
  CHART_SERIES_USER_SCORE.id,
  UserScoreChartSeriesConfig
);
