import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users';
import { AbstractCreateActivityDto, IHabit } from '@lyvely/common';
import { Profile } from '../../profiles';
import { Activity } from './activity.schema';
import { ContentDocument } from '../../content';
import { NumberDataPointConfigRevision } from "../../time-series";

export type HabitDocument = Habit & ContentDocument;

@Schema()
export class Habit extends Activity implements IHabit {
  public static create(profile: Profile, owner: User, dto: AbstractCreateActivityDto, history?: NumberDataPointConfigRevision[]): Habit {
    const result = Activity.createActivityType(profile, owner, dto, Habit);
    if(history) result.dataPointConfig.history = history;
    return result;
  }

  afterInit() {
    this.dataPointConfig.min = this.dataPointConfig.min ?? 0;
    this.dataPointConfig.max = this.dataPointConfig.max ?? 1;
    super.afterInit();
  }
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
