import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IContentEntity } from '@/content';
import { TextDataPointConfig, TextDataPointConfigSchema } from '../../config';
import { EntityType } from '@/core';
import { TimeSeriesContent } from './time-series-content.schema';
import { BaseModel, ITimeSeriesContentConfig } from '@lyvely/common';

type TextTimeSeriesContentEntity = IContentEntity & EntityType<TextTimeSeriesContent>;

export class TextTimeSeriesContentConfig<
    T extends ITimeSeriesContentConfig<TextDataPointConfig> = ITimeSeriesContentConfig<TextDataPointConfig>,
    Types extends TextDataPointConfig = TextDataPointConfig,
  >
  extends BaseModel<T>
  implements ITimeSeriesContentConfig<TextDataPointConfig>
{
  @Prop({ type: TextDataPointConfigSchema })
  timeSeries: Types;
}

export const TextTimeSeriesContentConfigSchema = SchemaFactory.createForClass(
  TextTimeSeriesContentConfig,
);

export abstract class TextTimeSeriesContent<
  T extends TextTimeSeriesContentEntity = TextTimeSeriesContentEntity,
> extends TimeSeriesContent<T, TextDataPointConfig> {
  @Prop({ type: TextTimeSeriesContentConfigSchema, required: true })
  config: TextTimeSeriesContentConfig;
}
