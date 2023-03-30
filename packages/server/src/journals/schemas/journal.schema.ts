import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfig,
  DataPointConfigFactory,
  DataPointConfigSchema,
  DataPointConfigHandler,
  RangeNumberDataPointConfig,
  SpinnerNumberDataPointConfig,
  TextareaTextDataPointConfig,
  TimeNumberDataPointConfig,
  TimeSeriesConfigSchemaFactory,
  TimeSeriesContent,
} from '@/time-series';
import {
  CreateJournalModel,
  DataPointInputType,
  DataPointValueType,
  ITimeSeriesContentConfig,
  PropertiesOf,
  UpdateHabitModel,
  UpdateJournalModel,
} from '@lyvely/common';
import { User } from '@/users';
import { assureObjectId, NestedSchema } from '@/core';
import { Profile } from '@/profiles';
import { ContentDataType } from '@/content';

type JournalDataPointConfig =
  | TextareaTextDataPointConfig
  | CheckboxNumberDataPointConfig
  | SpinnerNumberDataPointConfig
  | TimeNumberDataPointConfig
  | RangeNumberDataPointConfig;

@NestedSchema()
export class JournalConfig implements ITimeSeriesContentConfig {
  @Prop({ type: DataPointConfigSchema, required: true })
  timeSeries: JournalDataPointConfig;

  constructor(timeSeries: JournalDataPointConfig) {
    this.timeSeries = timeSeries;
  }
}

export const JournalConfigSchema = TimeSeriesConfigSchemaFactory.createForClass(JournalConfig, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Text, DataPointInputType.Textarea),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Range),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Spinner),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Time),
]);

/**
 * Base Activity content class.
 */
@Schema()
export class Journal extends TimeSeriesContent<Journal> {
  @Prop({ type: JournalConfigSchema, required: true })
  config: JournalConfig;

  public static create(profile: Profile, owner: User, update: PropertiesOf<CreateJournalModel>) {
    const { title, text } = update;
    return new Journal(profile, owner, {
      content: new ContentDataType({ title, text }),
      tagIds: profile.getTagsByName(update.tagNames).map((tag) => assureObjectId(tag.id)),
      config: new JournalConfig(
        DataPointConfigFactory.createConfig(update.type, update.inputType, update),
      ),
    });
  }

  applyUpdate(update: UpdateJournalModel) {
    DataPointConfigHandler.applyUpdate(this, update);
    this.applyContentUpdate({
      title: update.title ?? this.content.title,
      text: update.text ?? this.content.text,
    });
    return this;
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

  toModel(user?: User): any {
    return '';
  }
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
