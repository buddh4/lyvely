import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserEmailModel } from '@lyvely/interface';
import { PropertiesOf, validateEmail } from '@lyvely/common';
import { NestedSchema } from '@/core';

@NestedSchema()
export class UserEmail implements PropertiesOf<UserEmailModel> {
  @Prop({ required: true, validate: { validator: validateEmail } })
  email: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  constructor(email: string, verified = false) {
    this.email = email;
    this.verified = verified;
  }
}

export const UserEmailSchema = SchemaFactory.createForClass(UserEmail);
