import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profiles.schema';
import { ProfileType } from '@lyvely/profiles-interface';
import { User } from '@lyvely/users';
import { EntityIdentity } from '@lyvely/core';

@Schema({ timestamps: true })
export class UserProfile extends Profile {
  constructor(owner: EntityIdentity<User>, obj?: Partial<UserProfile>) {
    super(owner, obj);
    this.type = ProfileType.User;
  }
}

export const UserProfileSchema = SchemaFactory.createForClass(Profile);
