import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users';
import {
  CreateHabitModel,
  DataPointInputType,
  DataPointValueType,
  HabitModel,
  ITimeSeriesContentConfig,
  PropertiesOf,
  PropertyType,
  UpdateHabitModel,
} from '@lyvely/common';
import { Profile } from '@/profiles';
import { ContentDocument, ContentDataType } from '@/content';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  DataPointConfigHandler,
  DataPointConfigSchema,
  RangeNumberDataPointConfig,
  SpinnerNumberDataPointConfig,
  TimeSeriesConfigSchemaFactory,
  TimeSeriesContent,
  TimerDataPointConfig,
} from '@/time-series';
import { assureObjectId, NestedSchema } from '@/core';

export type HabitDocument = Habit & ContentDocument;

type HabitDataPointConfig =
  | CheckboxNumberDataPointConfig
  | SpinnerNumberDataPointConfig
  | TimerDataPointConfig
  | RangeNumberDataPointConfig;

@NestedSchema()
export class HabitConfig implements ITimeSeriesContentConfig<HabitDataPointConfig> {
  @Prop({ type: DataPointConfigSchema, required: true })
  timeSeries: HabitDataPointConfig;

  @Prop({ type: Number })
  @PropertyType(Number, { default: 0 })
  score: number;

  constructor(timeSeries: HabitDataPointConfig, score: number) {
    this.timeSeries = timeSeries;
    this.score = score;
  }
}

export const HabitConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(HabitConfig, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Range),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Spinner),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Timer, DataPointInputType.Timer),
]);

@Schema()
export class Habit
  extends TimeSeriesContent<Habit, HabitDataPointConfig>
  implements PropertiesOf<HabitModel>
{
  @Prop({ type: HabitConfigSchema, required: true })
  @PropertyType(HabitConfig)
  config: HabitConfig;

  public static create(profile: Profile, owner: User, update: PropertiesOf<CreateHabitModel>) {
    const { title, text } = update;
    return new Habit(profile, owner, {
      content: new ContentDataType({ title, text }),
      tagIds: profile.getTagsByName(update.tagNames).map((tag) => assureObjectId(tag.id)),
      config: new HabitConfig(
        DataPointConfigFactory.createConfig(update.valueType, update.inputType, update),
        update.score,
      ),
    });
  }

  getDefaultConfig(): any {
    return DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(
      DataPointValueType.Number,
      DataPointInputType.Checkbox,
      {
        min: 0,
        max: 1,
      },
    );
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
