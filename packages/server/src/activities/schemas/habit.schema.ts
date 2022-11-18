import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users';
import {
  HabitModel,
  UpdateHabitDto,
  applyValidationProperties,
  PropertiesOf,
  CreateHabitDto,
  DataPointValueType,
  DataPointInputType,
} from '@lyvely/common';
import { Profile } from '@/profiles';
import { Activity } from './activity.schema';
import { ContentDocument } from '@/content';
import { CheckboxNumberDataPointConfig, DataPointConfigFactory, NumberDataPointConfigRevision } from '@/time-series';
import { assureObjectId } from '@/core';
import { cloneDeep } from 'lodash';
import { ContentDataType } from '@/content/schemas/content-data-type.schema';

export type HabitDocument = Habit & ContentDocument;

@Schema()
export class Habit extends Activity implements PropertiesOf<HabitModel> {
  static applyUpdate(model: Habit, update: UpdateHabitDto) {
    const updatedDataPointConfig = cloneDeep(model.dataPointConfig);
    updatedDataPointConfig.min = update.min ?? model.dataPointConfig.min;
    updatedDataPointConfig.max = update.max ?? model.dataPointConfig.max;
    updatedDataPointConfig.optimal = update.optimal ?? model.dataPointConfig.optimal;
    updatedDataPointConfig.interval = update.interval ?? model.dataPointConfig.interval;
    updatedDataPointConfig.inputType = update.inputType || model.dataPointConfig.inputType;
    // TODO: implement input strategy edit
    //model.dataPointConfig.strategy = update.inputStrategy ?? model.dataPointConfig.strategy;

    // TODO: find better solution for this policy, e.g. in dataPointConfig itself
    if (updatedDataPointConfig.inputType === DataPointInputType.Checkbox) {
      updatedDataPointConfig.max = Math.min(8, updatedDataPointConfig.max);
    }

    if (model.dataPointConfigRevisionCheck(updatedDataPointConfig)) {
      const oldDataPointConfig = model.dataPointConfig;
      model.dataPointConfig = updatedDataPointConfig;
      model.pushDataPointConfigRevision(oldDataPointConfig);
    } else {
      model.dataPointConfig = updatedDataPointConfig;
    }

    model.data.title = update.title || model.data.title;
    model.data.textContent = update.text || model.data.textContent;

    applyValidationProperties(model, update);
  }

  public static create(
    profile: Profile,
    owner: User,
    update: CreateHabitDto,
    history?: NumberDataPointConfigRevision[],
  ): Habit {
    const result = new Habit(profile, owner, {
      ...update,
      score: update.score,
      data: new ContentDataType({ title: update.title, textContent: update.text }),
      tagIds: profile.getTagsByName(update.tagNames).map((tag) => assureObjectId(tag.id)),
      dataPointConfig: _createDataPointConfigFromUpdate(update),
    });

    if (history) result.dataPointConfig.history = history;
    return result;
  }

  afterInit() {
    this.dataPointConfig.min = this.dataPointConfig.min ?? 0;
    this.dataPointConfig.max = this.dataPointConfig.max ?? 1;

    if (this.dataPointConfig.inputType === DataPointInputType.Checkbox) {
      this.dataPointConfig.max = Math.min(8, this.dataPointConfig.max);
    }

    super.afterInit();
  }
}

function _createDataPointConfigFromUpdate(dto: UpdateHabitDto) {
  return DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(DataPointValueType.Number, dto.inputType, {
    min: dto.min,
    max: dto.max,
    interval: dto.interval,
    optimal: dto.optimal,
  });
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
