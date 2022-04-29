import { ITimeSeriesContent } from 'lyvely-common';
import { Prop } from '@nestjs/mongoose';
import { ContentEntity } from '../../content';
import { NumberDataPointConfig, NumberDataPointConfigSchema } from './config';
import {  EntityType } from '../../db/base.entity';
import { TimeSeriesContent } from "./time-series-content.schema";

type TimeSeriesContentEntity = ContentEntity & EntityType<ITimeSeriesContent>;

export abstract class NumberTimeSeriesContent<T extends TimeSeriesContentEntity = TimeSeriesContentEntity> extends TimeSeriesContent<T> implements ITimeSeriesContent {
  @Prop({ type: NumberDataPointConfigSchema, required: true })
  dataPointConfig: NumberDataPointConfig;
}


