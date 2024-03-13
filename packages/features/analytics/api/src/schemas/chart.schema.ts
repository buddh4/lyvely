import { ContentType, NestedSchema, User } from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getStringEnumValues, BaseModel, type PropertiesOf } from '@lyvely/common';
import { ChartModel, ChartState, ChartType, IChartStatus } from '@lyvely/analytics-interface';
import { ChartSeriesConfig, ChartSeriesConfigSchema } from './chart-series-config.schema';

@NestedSchema()
export class ChartStatus {
  @Prop({ enum: getStringEnumValues(ChartState), required: true })
  state: ChartState;

  constructor(data?: PropertiesOf<ChartStatus>) {
    BaseModel.init(this, data);
  }
}

const ChartStatusSchema = SchemaFactory.createForClass(ChartStatus);

@NestedSchema({ discriminatorKey: 'type' })
export class ChartConfig {
  type: ChartType;

  @Prop({ type: [ChartSeriesConfigSchema] })
  series: ChartSeriesConfig[];

  constructor(data?: PropertiesOf<ChartConfig>) {
    BaseModel.init(this, data);
  }
}

const ChartConfigSchema = SchemaFactory.createForClass(ChartConfig);

@Schema()
export class Chart<TConfig extends ChartConfig = ChartConfig> extends ContentType<Chart> {
  @Prop({ type: ChartStatusSchema })
  status: IChartStatus;

  @Prop({ type: ChartConfigSchema, required: true })
  override config: TConfig;

  addSeries(series: ChartSeriesConfig) {
    this.config.series.push(series);
  }

  toModel(user?: User): ChartModel {
    return new ChartModel(this);
  }
}

export const ChartSchema = SchemaFactory.createForClass(Chart);
