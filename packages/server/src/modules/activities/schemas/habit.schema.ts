import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users';
import { HabitModel, DataPointNumberInputStrategy, UpdateHabitDto } from '@lyvely/common';
import { Profile } from '../../profiles';
import { Activity } from './activity.schema';
import { ContentDocument } from '../../content';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  NumberDataPointConfigRevision
} from "../../../interfaces/time-series";
import { assureObjectId } from "../../../core/db/db.utils";
import { cloneDeep } from "lodash";
import { applyValidationProperties } from "@lyvely/common";
import { PropertiesOf } from "@lyvely/common/src";

export type HabitDocument = Habit & ContentDocument;

@Schema()
export class Habit extends Activity implements PropertiesOf<HabitModel> {
  static applyUpdate(model: Habit, update: UpdateHabitDto) {
    const updatedDataPointConfig = cloneDeep(model.dataPointConfig);
    updatedDataPointConfig.min = update.min ?? model.dataPointConfig.min;
    updatedDataPointConfig.max = update.max ?? model.dataPointConfig.max;
    updatedDataPointConfig.optimal = update.optimal ?? model.dataPointConfig.optimal;
    updatedDataPointConfig.interval = update.interval ?? model.dataPointConfig.interval;
    // TODO: implement input strategy edit
    //model.dataPointConfig.strategy = update.inputStrategy ?? model.dataPointConfig.strategy;

    if (model.dataPointConfigRevisionCheck(updatedDataPointConfig)) {
      model.pushDataPointConfigRevision(model.dataPointConfig);
      model.dataPointConfig = updatedDataPointConfig;
    }

    applyValidationProperties(model, update);
  }

  public static create(profile: Profile, owner: User, update: UpdateHabitDto, history?: NumberDataPointConfigRevision[]): Habit {
    const result = new Habit(profile, owner, {
      ...update,
      tagIds: profile.getTagsByName(update.tagNames).map(tag => assureObjectId(tag.id)),
      dataPointConfig: _createDataPointConfigFromUpdate(update)
    });

    if (history) result.dataPointConfig.history = history;
    return result;
  }

  afterInit() {
    this.dataPointConfig.min = this.dataPointConfig.min ?? 0;
    this.dataPointConfig.max = this.dataPointConfig.max ?? 1;
    super.afterInit();
  }
}

function _createDataPointConfigFromUpdate(dto: UpdateHabitDto) {
  return DataPointConfigFactory.createConfig<CheckboxNumberDataPointConfig>(
    dto.strategy || DataPointNumberInputStrategy.CheckboxNumber,
    {
      min: dto.min,
      max: dto.max,
      interval: dto.interval,
      optimal: dto.optimal
    })
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
