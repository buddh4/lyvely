import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  DataPointConfigSchema,
  RangeNumberDataPointConfig,
  SpinnerNumberDataPointConfig,
  TextareaTextDataPointConfig,
  TimeSeriesConfigSchemaFactory,
  TimeSeriesContent,
  CheckboxSelectionDataPointConfig,
  RadioSelectionDataPointConfig,
  DropdownSelectionDataPointConfig,
  useDataPointConfigHandler,
  DataPointInputType,
  DataPointValueType,
  ITimeSeriesContentConfig,
} from '@lyvely/time-series';
import { CreateJournalModel, JournalModel, UpdateJournalModel } from '@lyvely/journals-interface';
import { User } from '@lyvely/users';
import { PropertiesOf } from '@lyvely/common';
import { assureObjectId, NestedSchema } from '@lyvely/core';
import { Profile } from '@lyvely/profiles';
import { ContentDataType } from '@lyvely/content';
import { Types } from 'mongoose';

type JournalDataPointConfig =
  | TextareaTextDataPointConfig
  | CheckboxNumberDataPointConfig
  | SpinnerNumberDataPointConfig
  | RangeNumberDataPointConfig
  | RadioSelectionDataPointConfig
  | DropdownSelectionDataPointConfig
  | CheckboxSelectionDataPointConfig;

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
  DataPointConfigFactory.getStrategyName(DataPointValueType.Selection, DataPointInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Selection, DataPointInputType.Radio),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Selection, DataPointInputType.Dropdown),
]);

/**
 * Base Activity content class.
 */
@Schema()
export class Journal
  extends TimeSeriesContent<Journal, JournalDataPointConfig>
  implements PropertiesOf<JournalModel<Types.ObjectId>>
{
  @Prop({ type: JournalConfigSchema, required: true })
  config: JournalConfig;

  public static create(profile: Profile, owner: User, model: PropertiesOf<CreateJournalModel>) {
    const { title, text } = model;
    return new Journal(profile, owner, {
      content: new ContentDataType({ title, text }),
      tagIds: profile.getTagsByName(model.tagNames || []).map((tag) => assureObjectId(tag.id)),
      config: new JournalConfig(
        DataPointConfigFactory.initializeConfig(model.valueType, model.inputType, model),
      ),
    });
  }

  applyUpdate(update: UpdateJournalModel) {
    useDataPointConfigHandler().applyUpdate(this, update);
    this.applyContentUpdate({
      title: update.title ?? this.content.title,
      text: update.text ?? this.content.text,
    });
    return this;
  }

  toModel(user?: User): JournalModel<any> {
    return new JournalModel(this);
  }
}

export const JournalSchema = SchemaFactory.createForClass(Journal);