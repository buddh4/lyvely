import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users';
import {
  CreateHabitModel,
  DataPointInputType,
  DataPointValueType,
  HabitModel,
  PropertiesOf,
  PropertyType,
  UpdateHabitModel,
} from '@lyvely/common';
import { Profile } from '@/profiles';
import { Activity } from './activity.schema';
import { ContentDocument } from '@/content';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  DataPointConfigHandler,
  NumberDataPointConfig,
  NumberDataPointConfigRevision,
  NumberTimeSeriesContentConfig,
  RangeNumberDataPointConfig,
  SpinnerNumberDataPointConfig,
  TimeNumberDataPointConfig,
  TimeSeriesConfigSchemaFactory,
  useDataPointConfigStrategyRegistry,
} from '@/time-series';
import { assureObjectId } from '@/core';
import { ContentDataType } from '@/content/schemas/content-data-type.schema';
import { pick } from 'lodash';

export type HabitDocument = Habit & ContentDocument;

type HabitDataPointConfig =
  | CheckboxNumberDataPointConfig
  | SpinnerNumberDataPointConfig
  | TimeNumberDataPointConfig
  | RangeNumberDataPointConfig;

@Schema({ _id: false })
export class HabitConfig extends NumberTimeSeriesContentConfig<HabitConfig, HabitDataPointConfig> {
  @Prop({ type: Number })
  @PropertyType(Number, { default: 0 })
  score: number;
}

export const HabitConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(HabitConfig, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Range),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Spinner),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Time),
]);

@Schema()
export class Habit extends Activity implements PropertiesOf<HabitModel> {
  @Prop({ type: HabitConfigSchema, required: true })
  @PropertyType(HabitConfig)
  config: HabitConfig;

  public static create(
    profile: Profile,
    owner: User,
    update: PropertiesOf<CreateHabitModel>,
    history?: NumberDataPointConfigRevision[],
  ): Habit {
    update.inputType = update.inputType || DataPointInputType.Checkbox;

    const result = new Habit(profile, owner, {
      content: new ContentDataType(update),
      tagIds: profile.getTagIdsByName(update.tagNames),
      config: new HabitConfig({
        score: update.score,
        timeSeries: DataPointConfigFactory.createConfig<NumberDataPointConfig>(
          DataPointValueType.Number,
          update.inputType,
          {
            min: update.min,
            max: update.max,
            interval: update.interval,
            optimal: update.optimal,
            userStrategy: update.userStrategy,
          },
        ),
      }),
    });

    DataPointConfigHandler.prepareConfig(result);

    if (history) result.timeSeriesConfig.history = history;
    return result;
  }

  toModel(): HabitModel {
    return new HabitModel(this);
  }

  applyUpdate(update: UpdateHabitModel) {
    DataPointConfigHandler.applyUpdate(this, update);
    this.applyContentUpdate({
      title: update.title ?? this.content.title,
      text: update.text ?? this.content.text,
    });

    return this;
  }
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
