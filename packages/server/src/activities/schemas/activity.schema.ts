import { Prop, Schema } from '@nestjs/mongoose';
import { Profile } from '../../profiles';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import {
  IActivity,
  DataPointInputStrategy,
  AbstractCreateActivityDto,
  DataPointNumberInputStrategy
} from 'lyvely-common';
import {
  CheckboxNumberDataPointConfig, SpinnerNumberDataPointConfig,
  TimeSeriesContent,
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
export class Activity extends TimeSeriesContent<Activity> implements IActivity {

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
    user: User, profile: Profile, dto: AbstractCreateActivityDto, type: ContentConstructor<Activity>
  ): T {

    dto.strategy = dto.strategy || DataPointNumberInputStrategy.CheckboxNumber;

    return new type(user, profile, {
      title: dto.title,
      text: dto.text,
      interval: dto.interval,
      categories: dto.categories,
      score: dto.score,
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