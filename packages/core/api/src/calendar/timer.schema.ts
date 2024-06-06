import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { TimerModel, TimeSpanModel } from '@lyvely/interface';
import { PropertyType } from '@lyvely/common';
import { User } from '@/users';
import { assureObjectId, DocumentIdentity, NestedSchema, ObjectIdProp, TObjectId } from '@/core';

@NestedSchema()
export class TimeSpan extends TimeSpanModel<TObjectId> {
  @ObjectIdProp({ immutable: true })
  override uid?: TObjectId;

  @Prop({ required: true })
  override from: number;

  @Prop()
  override to?: number;

  constructor(user: DocumentIdentity<User>) {
    super(assureObjectId(user));
  }
}

export const TimeSpanSchema = SchemaFactory.createForClass(TimeSpan);

@NestedSchema()
export class Timer extends TimerModel<TObjectId> {
  @ObjectIdProp({ immutable: true })
  override uid?: TObjectId;

  @Prop({ type: [TimeSpanSchema] })
  @PropertyType([TimeSpan])
  override spans: TimeSpan[] = [];

  override start(user?: DocumentIdentity<User>) {
    return super.start(assureObjectId(user, true));
  }

  constructor(userIdentity?: DocumentIdentity<any>) {
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
