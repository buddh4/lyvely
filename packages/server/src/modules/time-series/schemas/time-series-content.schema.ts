import { isSameDay, UserAssignmentStrategy, getNumberEnumValues   , IDataPointConfig } from '@lyvely/common';
import { Prop } from '@nestjs/mongoose';
import { Content, ContentEntity } from '../../content';
import {
  DataPointConfigFactory,
  DefaultDataPointConfig,
  DefaultDataPointConfigSchema,
} from './config';
import { EntityType } from '../../core/db/base.entity';
import { TimeSeriesContentModel } from "@lyvely/common";

type TimeSeriesContentEntity = ContentEntity & EntityType<TimeSeriesContent>;
export type ITimeSeriesContentEntity<TDataPointConfig extends IDataPointConfig = DefaultDataPointConfig> = TimeSeriesContentModel<TDataPointConfig>

/**
 * This class serves as base class for all time series content types and schemas. A subclass usually overwrites the
 * `dataPointConfig` schema type either with a custom or a predefined one as NumberDataPointConfig as well as overwriting
 * `dataPointConfigHistory` schema.
 */
export abstract class TimeSeriesContent<
  TContent extends TimeSeriesContentEntity = TimeSeriesContentEntity,
  TDataPointConfig extends DefaultDataPointConfig = DefaultDataPointConfig>
    extends Content<TContent>  implements ITimeSeriesContentEntity<TDataPointConfig> {

  @Prop({ type: Number, min: 0 })
  sortOrder: number;

  @Prop({ type: DefaultDataPointConfigSchema, required: true })
  dataPointConfig: TDataPointConfig;

  @Prop({ enum: getNumberEnumValues(UserAssignmentStrategy), default: UserAssignmentStrategy.Shared, required: true })
  userStrategy: UserAssignmentStrategy;

  abstract pushDataPointConfigRevision(rev: TDataPointConfig);

  dataPointConfigRevisionCheck(update: TDataPointConfig) {
    return !this.dataPointConfig.isEqualTo(update) && !this.getRevisionUpdatedAt(new Date());
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


