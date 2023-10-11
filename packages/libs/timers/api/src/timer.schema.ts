import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TimerModel, TimeSpanModel } from '@lyvely/timers-interface';
import { PropertyType, PropertiesOf } from '@lyvely/common';
import { User, assureObjectId, EntityIdentity, NestedSchema, ObjectIdProp } from '@lyvely/core';

@NestedSchema()
export class TimeSpan extends TimeSpanModel implements PropertiesOf<TimeSpanModel> {
  @ObjectIdProp({ immutable: true })
  uid?: Types.ObjectId;

  @Prop({ required: true })
  from: number;

  @Prop()
  to?: number;

  constructor(user: EntityIdentity<User>) {
    super(assureObjectId(user));
  }

  afterInit() {
    if (this.uid) {
      this.uid = assureObjectId(this.uid);
    }
  }
}

export const TimeSpanSchema = SchemaFactory.createForClass(TimeSpan);

@NestedSchema()
export class Timer extends TimerModel<Types.ObjectId> {
  @ObjectIdProp({ immutable: true })
  uid?: Types.ObjectId;

  @Prop({ type: [TimeSpanSchema] })
  @PropertyType([TimeSpan])
  spans: TimeSpan[] = [];

  start(user?: EntityIdentity<User>) {
    return super.start(assureObjectId(user, true));
  }

  constructor(userIdentity?: EntityIdentity<any>) {
    super();
    if (userIdentity) {
      this.uid = assureObjectId(userIdentity, true);
    }
  }

  afterInit() {
    if (this.uid) {
      this.uid = assureObjectId(this.uid, true);
    }
  }
}

export const TimerSchema = SchemaFactory.createForClass(Timer);
