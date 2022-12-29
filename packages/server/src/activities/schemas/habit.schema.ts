import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users';
import {
  ActivityModel,
  ContentModel,
  CreateHabitDto,
  DataPointInputType,
  DataPointValueType,
  HabitModel,
  PropertiesOf,
  PropertyType,
  Type,
  UpdateHabitDto,
} from '@lyvely/common';
import { Profile } from '@/profiles';
import { Activity } from './activity.schema';
import { ContentDocument } from '@/content';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  NumberDataPointConfigRevision,
  NumberTimeSeriesContentConfig,
  RangeNumberDataPointConfig,
  SpinnerNumberDataPointConfig,
  TimeNumberDataPointConfig,
  TimeSeriesConfigSchemaFactory,
} from '@/time-series';
import { assureObjectId } from '@/core';
import { ContentDataType } from '@/content/schemas/content-data-type.schema';

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

  modelConstructor = HabitModel;

  public static create(
    profile: Profile,
    owner: User,
    update: PropertiesOf<CreateHabitDto>,
    history?: NumberDataPointConfigRevision[],
  ): Habit {
    update.inputType = update.inputType || DataPointInputType.Checkbox;

    const result = new Habit(profile, owner, {
      content: new ContentDataType({ title: update.title, text: update.text }),
      tagIds: profile.getTagsByName(update.tagNames).map((tag) => assureObjectId(tag.id)),
      config: new HabitConfig({
        score: update.score,
        timeSeries: _createDataPointConfigFromUpdate(update),
      }),
    });

    if (history) result.timeSeriesConfig.history = history;
    return result;
  }

  getModelConstructor(): Type<ContentModel> {
    return HabitModel;
  }

  applyUpdate(update: UpdateHabitDto) {
    this.applyTimeSeriesConfigUpdate({
      max: update.max ?? this.timeSeriesConfig.max,
      min: update.max ?? this.timeSeriesConfig.min,
      optimal: update.max ?? this.timeSeriesConfig.optimal,
      inputType: update.inputType ?? this.timeSeriesConfig.inputType,
      userStrategy: update.userStrategy ?? this.timeSeriesConfig.userStrategy,
      interval: update.interval ?? this.timeSeriesConfig.interval,
    });

    this.applyContentUpdate({
      title: update.title ?? this.content.title,
      text: update.title ?? this.content.text,
    });

    return this;
  }
}

function _createDataPointConfigFromUpdate(dto: UpdateHabitDto) {
  return DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(
    DataPointValueType.Number,
    dto.inputType,
    {
      min: dto.min,
      max: dto.max,
      interval: dto.interval,
      optimal: dto.optimal,
      userStrategy: dto.userStrategy,
    },
  );
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
