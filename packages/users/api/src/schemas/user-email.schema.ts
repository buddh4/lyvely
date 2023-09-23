import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserEmailModel } from '@lyvely/users-interface';
import { PropertiesOf, validateEmail } from '@lyvely/common';

@Schema({ _id: false })
export class UserEmail implements PropertiesOf<UserEmailModel> {
  @Prop({ required: true, validate: { validator: validateEmail } })
  email: string;

  @Prop({ required: true, validate: { validator: validateEmail } })
  lowercaseEmail: string;

  @Prop({ type: Boolean })
  verified: boolean;

  constructor(email: string, verified = false) {
    this.email = email;
    this.lowercaseEmail = email.toLowerCase();
    this.verified = verified;
  }
}

export const UserEmailSchema = SchemaFactory.createForClass(UserEmail);
