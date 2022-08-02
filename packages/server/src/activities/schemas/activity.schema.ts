import { Prop, Schema } from '@nestjs/mongoose';
import { Profile } from '../../profiles';
import * as mongoose from 'mongoose';
import { User } from '../../users';
import {
  IActivity,
  DataPointInputStrategy,
  AbstractCreateActivityDto,
  DataPointNumberInputStrategy
, UserAssignmentStrategy } from 'lyvely-common';
import {
  CheckboxNumberDataPointConfig, SpinnerNumberDataPointConfig,
  NumberTimeSeriesContent,
  TimeSeriesContentSchemaFactory,
  TimeSeriesDataPointConfigSchema,
  DataPointConfigFactory
} from '../../time-series';
import { ContentConstructor } from '../../content';

type ActivityDataPointConfig = CheckboxNumberDataPointConfig | SpinnerNumberDataPointConfig;

/**
 * Base Activity content class.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Activity extends NumberTimeSeriesContent<Activity> implements IActivity {

  @Prop({ required: true })
  title: string;

  @Prop({ type: Number })
  sortOrder: number;

  @Prop({ type: Number, default: 0 })
  score: number;

  @Prop({ type: TimeSeriesDataPointConfigSchema, required: true })
  dataPointConfig: ActivityDataPointConfig;

  type: string;

  static createActivityType<T extends Activity>(
    profile: Profile, user: User, dto: AbstractCreateActivityDto, type: ContentConstructor<Activity>
  ): T {

    dto.strategy = dto.strategy || DataPointNumberInputStrategy.CheckboxNumber;

    return new type(profile, user, {
      title: dto.title,
      text: dto.text,
      interval: dto.interval,
      categories: dto.categories,
      score: dto.score,
      userStrategy: dto.userStrategy ?? UserAssignmentStrategy.Shared,
      dataPointConfig: DataPointConfigFactory.createConfig<ActivityDataPointConfig>(dto.strategy, {
        min: dto.min,
        max: dto.max,
        optimal: dto.optimal
      })
    }) as T;
  }
}

export type ActivityDocument = Activity & mongoose.Document;
export const ActivitySchema = TimeSeriesContentSchemaFactory.createForClass(Activity, [
  DataPointInputStrategy.CheckboxNumber,
  DataPointInputStrategy.RangeNumber,
  DataPointInputStrategy.SpinnerNumber
]);
