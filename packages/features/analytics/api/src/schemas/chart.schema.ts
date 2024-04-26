import { ContentType, NestedSchema, TObjectId, User } from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  getStringEnumValues,
  BaseModel,
  type PropertiesOf,
  type BaseModelData,
  PropertyType,
} from '@lyvely/common';
import { ChartModel, ChartState, IChartConfig, IChart } from '@lyvely/analytics-interface';
import { ChartSeriesConfig, ChartSeriesConfigSchema } from './chart-series-config.schema';
import type { IChartStatus } from '@lyvely/analytics-interface';

@NestedSchema()
export class ChartStatus implements IChartStatus {
  @Prop({ enum: getStringEnumValues(ChartState), required: true })
  state: ChartState;

  constructor(data?: PropertiesOf<ChartStatus>) {
    BaseModel.init(this, data);
  }
}

const ChartStatusSchema = SchemaFactory.createForClass(ChartStatus);

@NestedSchema({ discriminatorKey: 'category' })
export class ChartConfig implements IChartConfig {
  category: string;

  @Prop({ type: [ChartSeriesConfigSchema] })
  @PropertyType([ChartSeriesConfig])
  series: ChartSeriesConfig[];

  constructor(data?: BaseModelData<ChartConfig>) {
    BaseModel.init(this, data);
  }
}

const ChartConfigSchema = SchemaFactory.createForClass(ChartConfig);

@Schema()
export class Chart<TConfig extends ChartConfig = ChartConfig>
  extends ContentType<TConfig>
  implements IChart<TObjectId>
{
  @Prop({ type: ChartConfigSchema, required: true })
  @PropertyType(ChartConfig)
  override config: TConfig;

  @Prop({ type: ChartStatusSchema })
  override state: ChartStatus;

  override toModel(user?: User): ChartModel {
    return new ChartModel<string>(this);
  }

  addSeries(series: ChartSeriesConfig) {
    this.config.series.push(series);
  }
}

export const ChartSchema = SchemaFactory.createForClass(Chart);
