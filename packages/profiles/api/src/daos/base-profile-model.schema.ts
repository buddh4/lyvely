import { BaseEntity } from '@lyvely/core';
import mongoose from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export class BaseProfileModel<C extends BaseEntity<C>> extends BaseEntity<C> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  oid: mongoose.Types.ObjectId;

  @Prop({ required: true, default: 'default' })
  location: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;
}
