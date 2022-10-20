import { Prop } from '@nestjs/mongoose';
import { IContentEntity } from '../../content';
import { NumberDataPointConfig, NumberDataPointConfigRevision, NumberDataPointConfigSchema } from './config';
import { EntityType } from '../../core/db/base.entity';
import { TimeSeriesContent } from './time-series-content.schema';

type NumberTimeSeriesContentEntity = IContentEntity & EntityType<NumberTimeSeriesContent>;

export abstract class NumberTimeSeriesContent<
  T extends NumberTimeSeriesContentEntity = NumberTimeSeriesContentEntity,
> extends TimeSeriesContent<T, NumberDataPointConfig> {
  @Prop({ type: NumberDataPointConfigSchema, required: true })
  dataPointConfig: NumberDataPointConfig;

  pushDataPointConfigRevision(rev: NumberDataPointConfig) {
    if (!this.dataPointConfig.history) {
      this.dataPointConfig.history = [];
    }

    this.dataPointConfig.history.push(new NumberDataPointConfigRevision(rev));
  }
}
