import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profiles.schema';
import { EntityIdentity } from '@lyvely/server-core';
import { User } from '@/users';
import { ProfileType } from '@lyvely/common';

@Schema({ timestamps: true })
export class GroupProfile extends Profile {
  constructor(owner: EntityIdentity<User>, obj?: Partial<GroupProfile>) {
    super(owner, obj);
    this.type = ProfileType.Group;
  }
}

export const GroupProfileSchema = SchemaFactory.createForClass(Profile);
