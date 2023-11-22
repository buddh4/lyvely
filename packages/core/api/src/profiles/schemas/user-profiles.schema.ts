import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profiles.schema';
import { ProfileType } from '@lyvely/interface';
import { User } from '@/users';

@Schema({ timestamps: true })
export class UserProfile extends Profile {
  constructor(owner: User, obj?: Partial<UserProfile>) {
    super(owner, obj);
    this.type = ProfileType.User;
  }
}

export const UserProfileSchema = SchemaFactory.createForClass(Profile);
