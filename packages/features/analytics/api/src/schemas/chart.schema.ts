import { ContentType, NestedSchema, User } from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getStringEnumValues, BaseModel } from '@lyvely/common';
import { ChartModel, ChartState, ChartType, IChartStatus } from '@lyvely/analytics-interface';
import { ChartSeriesConfig, ChartSeriesConfigSchema } from './chart-series-config.schema';

@NestedSchema()
export class ChartStatus extends BaseModel<ChartStatus> {
  @Prop({ enum: getStringEnumValues(ChartState), required: true })
  state: ChartState;
}

const ChartStatusSchema = SchemaFactory.createForClass(ChartStatus);

@NestedSchema({ discriminatorKey: 'type' })
export class ChartConfig<TConfig = any> extends BaseModel<TConfig> {
  type: ChartType;

  @Prop({ type: [ChartSeriesConfigSchema] })
  series: ChartSeriesConfig[];
}

const ChartConfigSchema = SchemaFactory.createForClass(ChartConfig);

@Schema()
export class Chart<TConfig extends ChartConfig = ChartConfig> extends ContentType<Chart> {
  @Prop({ type: ChartStatusSchema })
  status: IChartStatus;

  @Prop({ type: ChartConfigSchema, required: true })
  config: TConfig;

  addSeries(series: ChartSeriesConfig) {
    this.config.series.push(series);
  }

  toModel(user?: User): ChartModel {
    return new ChartModel(this);
  }
}

export const ChartSchema = SchemaFactory.createForClass(Chart);
