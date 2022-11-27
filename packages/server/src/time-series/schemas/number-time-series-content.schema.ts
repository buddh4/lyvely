import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IContentEntity } from '@/content';
import { NumberDataPointConfig, NumberDataPointConfigRevision, NumberDataPointConfigSchema } from './config';
import { EntityType } from '@/core';
import { TimeSeriesContent } from './time-series-content.schema';
import { BaseModel, DataPointInputType, ITimeSeriesContentConfig } from '@lyvely/common';
import { isDefined } from 'class-validator';

type NumberTimeSeriesContentEntity = IContentEntity & EntityType<NumberTimeSeriesContent>;

export class NumberTimeSeriesContentConfig<
    T extends ITimeSeriesContentConfig<NumberDataPointConfig> = ITimeSeriesContentConfig<NumberDataPointConfig>,
    Types extends NumberDataPointConfig = NumberDataPointConfig,
  >
  extends BaseModel<T>
  implements ITimeSeriesContentConfig<NumberDataPointConfig>
{
  @Prop({ type: NumberDataPointConfigSchema })
  timeSeries: Types;
}

export const NumberTimeSeriesContentConfigSchema = SchemaFactory.createForClass(NumberDataPointConfig);

export abstract class NumberTimeSeriesContent<
  T extends NumberTimeSeriesContentEntity = NumberTimeSeriesContentEntity,
> extends TimeSeriesContent<T, NumberDataPointConfig> {
  @Prop({ type: NumberTimeSeriesContentConfigSchema, required: true })
  config: NumberTimeSeriesContentConfig;

  afterInit() {
    super.afterInit();

    if (!isDefined(this.timeSeriesConfig.max) && this.timeSeriesConfig.inputType === DataPointInputType.Checkbox) {
      this.timeSeriesConfig.max = 1;
    }

    if (this.timeSeriesConfig.max && this.timeSeriesConfig.inputType === DataPointInputType.Checkbox) {
      this.timeSeriesConfig.max = Math.min(8, this.timeSeriesConfig.max);
    }
  }

  applyTimeSeriesConfigUpdate(update: Partial<NumberDataPointConfig>) {
    if (update.max <= 0 && update.inputType === DataPointInputType.Checkbox) {
      update.max = 1;
    }

    if (update.max && update.inputType === DataPointInputType.Checkbox) {
      update.max = Math.min(8, update.max);
    }

    super.applyTimeSeriesConfigUpdate(update);
  }

  createTimeSeriesConfigRevision(rev: NumberDataPointConfig): NumberDataPointConfigRevision {
    return new NumberDataPointConfigRevision(rev);
  }
}
