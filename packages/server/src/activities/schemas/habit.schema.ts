import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/users.schema';
import { AbstractCreateActivityDto, IHabit } from 'lyvely-common';
import { Profile } from '../../profiles';
import { Activity } from './activity.schema';
import { ContentDocument } from '../../content';

export type HabitDocument = Habit & ContentDocument;

@Schema()
export class Habit extends Activity implements IHabit {
  public static create(owner: User, profile: Profile, dto: AbstractCreateActivityDto): Habit {
    return Activity.createActivityType(owner, profile, dto, Habit);
  }
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
