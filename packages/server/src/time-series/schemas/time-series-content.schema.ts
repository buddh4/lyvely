import { CalendarIntervalEnum, TimeSeriesUserStrategy, ITimeSeriesContent, getNumberEnumValues } from 'lyvely-common';
import { Prop } from '@nestjs/mongoose';
import { Content, ContentEntity } from '../../content';
import {
  DataPointConfigFactory,
  TimeSeriesDataPointConfig,
  TimeSeriesDataPointConfigSchema
} from './data-point-config';
import {  EntityType } from '../../db/base.entity';

type TimeSeriesContentEntity = ContentEntity & EntityType<ITimeSeriesContent>;

export abstract class TimeSeriesContent<T extends TimeSeriesContentEntity = TimeSeriesContentEntity> extends Content<T> implements ITimeSeriesContent {

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  @Prop({ type: Number })
  sortOrder: number;

  @Prop({ type: TimeSeriesDataPointConfigSchema, required: true })
  dataPointConfig: TimeSeriesDataPointConfig;

  // TODO: implement dataPointConfigHistory

  @Prop({ enum: getNumberEnumValues(TimeSeriesUserStrategy), default: TimeSeriesUserStrategy.Shared, required: true })
  userStrategy: TimeSeriesUserStrategy;

  afterInit() {
    // in case plain object is given we create an class instance
    if(!this.dataPointConfig.getSettings) {
      this.dataPointConfig = DataPointConfigFactory.createConfig(this.dataPointConfig.strategy, this.dataPointConfig);
    }
    super.afterInit();
  }
}


