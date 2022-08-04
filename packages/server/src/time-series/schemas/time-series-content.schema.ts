import { isSameDay, UserAssignmentStrategy, ITimeSeriesContent, getNumberEnumValues   } from 'lyvely-common';
import { Prop } from '@nestjs/mongoose';
import { Content, ContentEntity } from '../../content';
import {
  DataPointConfigFactory,
  DefaultDataPointConfig,
  DefaultDataPointConfigSchema,
} from './config';
import { EntityType } from '../../db/base.entity';

type TimeSeriesContentEntity = ContentEntity & EntityType<TimeSeriesContent>;

/**
 * This class serves as base class for all time series content types and schemas. A subclass usually overwrites the
 * `dataPointConfig` schema type either with a custom or a predefined one as NumberDataPointConfig as well as overwriting
 * `dataPointConfigHistory` schema.
 */
export abstract class TimeSeriesContent<T extends TimeSeriesContentEntity = TimeSeriesContentEntity> extends Content<T> implements ITimeSeriesContent {

  @Prop({ type: Number, min: 0 })
  sortOrder: number;

  @Prop({ type: DefaultDataPointConfigSchema, required: true })
  dataPointConfig: DefaultDataPointConfig;

  @Prop({ enum: getNumberEnumValues(UserAssignmentStrategy), default: UserAssignmentStrategy.Shared, required: true })
  userStrategy: UserAssignmentStrategy;

  abstract pushRevision(rev: T);

  revisionCheck(update: T) {
    return !this.dataPointConfig.isEqualTo(update.dataPointConfig) && !this.getRevisionUpdatedAt(new Date());
  }

  getRevisionUpdatedAt(date: Date) {
    if(!this.dataPointConfig?.history.length) {
      return false;
    }

    return this.dataPointConfig.history.find(rev => isSameDay(rev.validUntil, date))
  }

  afterInit() {
    // in case plain object is given we create a class instance
    if(this.dataPointConfig && !this.dataPointConfig.getSettings) {
      this.dataPointConfig = DataPointConfigFactory.createInstance(this.dataPointConfig.strategy, this.dataPointConfig);
    }

    super.afterInit();
  }
}


