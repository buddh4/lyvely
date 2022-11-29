import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@/core';
import mongoose from 'mongoose';
import { isDefined } from 'class-validator';
import { PropertyType } from '@lyvely/common';

@Schema()
export class UserNotification extends BaseEntity<UserNotification> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, require: true })
  uid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, require: true })
  notificationId: TObjectId;

  @Prop()
  @PropertyType(Boolean, { default: false })
  seen: boolean;

  @Prop({ required: true })
  sortOrder: number;

  afterInit() {
    if (!isDefined(this.sortOrder)) {
      this.sortOrder = Date.now();
    }
  }
}

export const UserNotificationSchema = SchemaFactory.createForClass(UserNotification);
export type UserNotificationDocument = mongoose.Document & UserNotification;
