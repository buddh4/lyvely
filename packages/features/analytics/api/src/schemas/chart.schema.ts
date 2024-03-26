import { ContentType, NestedSchema, User } from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  getStringEnumValues,
  BaseModel,
  type PropertiesOf,
  type BaseModelData,
} from '@lyvely/common';
import { ChartModel, ChartState, ChartCategory } from '@lyvely/analytics-interface';
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
  category: ChartCategory;

  @Prop({ type: [ChartSeriesConfigSchema] })
  series: ChartSeriesConfig[];

  constructor(data?: BaseModelData<ChartConfig>) {
    BaseModel.init(this, data);
  }
}

const ChartConfigSchema = SchemaFactory.createForClass(ChartConfig);

@Schema()
export class Chart<TConfig extends ChartConfig = ChartConfig> extends ContentType<TConfig> {
  @Prop({ type: ChartConfigSchema, required: true })
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
