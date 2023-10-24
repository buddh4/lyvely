import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PropertyType } from '@lyvely/common';

@Schema({ _id: false })
export class ProfilesCount {
  @PropertyType(Number, { default: 0 })
  @Prop({ required: true, min: 0, default: 0 })
  user: number;

  @PropertyType(Number, { default: 0 })
  @Prop({ required: true, min: 0, default: 0 })
  group: number;

  @PropertyType(Number, { default: 0 })
  @Prop({ required: true, min: 0, default: 0 })
  organization: number;

  constructor(obj: Partial<ProfilesCount> = {}) {
    this.user = obj.user ?? 0;
    this.group = obj.group ?? 0;
    this.organization = obj.organization ?? 0;
  }
}

export const ProfilesCountSchema = SchemaFactory.createForClass(ProfilesCount);
