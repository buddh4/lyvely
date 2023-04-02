import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IContentEntity } from '@/content';
import { SelectionDataPointConfig, SelectionDataPointConfigSchema } from '../../config';
import { EntityType } from '@/core';
import { TimeSeriesContent } from './time-series-content.schema';
import { BaseModel, ITimeSeriesContentConfig } from '@lyvely/common';

type SelectionTimeSeriesContentEntity = IContentEntity & EntityType<SelectionTimeSeriesContent>;

export class SelectionTimeSeriesContentConfig<
    T extends ITimeSeriesContentConfig<SelectionDataPointConfig> = ITimeSeriesContentConfig<SelectionDataPointConfig>,
    Types extends SelectionDataPointConfig = SelectionDataPointConfig,
  >
  extends BaseModel<T>
  implements ITimeSeriesContentConfig<SelectionDataPointConfig>
{
  @Prop({ type: SelectionDataPointConfigSchema })
  timeSeries: Types;
}

export const SelectionTimeSeriesContentConfigSchema = SchemaFactory.createForClass(
  SelectionTimeSeriesContentConfig,
);

export abstract class SelectionTimeSeriesContent<
  T extends SelectionTimeSeriesContentEntity = SelectionTimeSeriesContentEntity,
> extends TimeSeriesContent<T, SelectionDataPointConfig> {
  @Prop({ type: SelectionTimeSeriesContentConfigSchema, required: true })
  config: SelectionTimeSeriesContentConfig;
}
