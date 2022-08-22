/*import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import { Profile, } from '../../profiles';
import { IJournal } from '@lyvely/common';
import { IJournalLog, EditJournalDto } from '@lyvely/common';
import { TimeableContentLog, TimeableContent } from '../../calendar/timeable/schemas/timeable-content.schema';
import { CalendarIntervalEnum } from '@lyvely/common';
import { Timing, TimingSchema } from '../../calendar/schemas/calendar.schema';
import { Rating, RatingSchema } from '../../calendar/timeable/schemas/rating.schema';
import { assureObjectId } from '../../db/db.utils';
import { CalendarDate } from '@lyvely/common';
import { getNumberEnumValues } from '@lyvely/common';

@Schema({ timestamps: true })
export class Journal extends TimeableContent implements IJournal {
  @Prop({
    type: mongoose.Schema.Types.ObjectId, required: true,
  })
  createdBy: TObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId, required: true,
  })
  pid: TObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  plan: CalendarIntervalEnum;

  @Prop()
  text: string;

  @Prop({ default: false })
  archived: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Number })
  sortOrder: number;

  @Prop({ type: RatingSchema, required: true })
  rating: Rating;

  static create(profile: Profile, dto: EditJournalDto): Journal {
    const model = new Journal();
    model.createdBy = assureObjectId(profile.createdBy);
    model.pid = profile._id;
    model.title = dto.title;
    model.text = dto.description;
    model.tags = dto.tags;
    model.plan = dto.plan;
    model.rating = Journal.createRating(dto);
    return model;
  }

  static createRating = function (dto: EditJournalDto): Rating {
    const rating = new Rating();
    rating.type = dto.DataPointValueType;
    rating.inputType = dto.inputType;
    rating.max = dto.max;
    rating.min = dto.min ?? 0;
    rating.optimal = dto.optimal ?? dto.max;
    return rating;
  };
}

export type JournalDocument = Journal & mongoose.Document;
export const JournalSchema = SchemaFactory.createForClass(Journal);

@Schema({ timestamps: true })
export class JournalLog extends TimeableContentLog implements IJournalLog {
  @Prop({type: mongoose.Schema.Types.ObjectId, required: true,})
  uid: TObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, required: true})
  pid: TObjectId;

  @Prop({ type: TimingSchema, required: true })
  calendar: Timing;

  @Prop({ required: true })
  timingId: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, required: true})
  contentId: TObjectId;

  @Prop()
  value: number;

  @Prop()
  text: string;

  static create(owner: User, profile: Profile, journal: Journal, date: CalendarDate): JournalLog {
    const model = TimeableContentLog.pupulate<JournalLog>(
      new JournalLog(),
      owner,
      profile,
      journal,
      date,
    );
    model.text = '';
    model.value = 0;
    return model;
  }
}

export type JournalLogDocument = JournalLog & mongoose.Document;
export const JournalLogSchema = SchemaFactory.createForClass(JournalLog);
*/
