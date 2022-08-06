import { ITimeSeriesContent } from '@lyvely/common';
import { Prop } from '@nestjs/mongoose';
import { ContentEntity } from '../../content';
import {
  NumberDataPointConfig, NumberDataPointConfigRevision,
  NumberDataPointConfigSchema
} from './config';
import {  EntityType } from '../../db/base.entity';
import { TimeSeriesContent } from "./time-series-content.schema";

type NumberTimeSeriesContentEntity = ContentEntity & EntityType<NumberTimeSeriesContent>;

export abstract class NumberTimeSeriesContent<T extends NumberTimeSeriesContentEntity = NumberTimeSeriesContentEntity> extends TimeSeriesContent<T> implements ITimeSeriesContent {
  @Prop({ type: NumberDataPointConfigSchema, required: true })
  dataPointConfig: NumberDataPointConfig;

  pushRevision(rev: T) {
    if(!this.dataPointConfig.history) {
      this.dataPointConfig.history = [];
    }

    this.dataPointConfig.history.push(new NumberDataPointConfigRevision(rev.dataPointConfig))
  }
}
