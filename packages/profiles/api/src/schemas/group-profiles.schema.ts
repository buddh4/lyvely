import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profiles.schema';
import { EntityIdentity } from '@lyvely/core';
import { User } from '@lyvely/users';
import { ProfileType } from '@lyvely/common';

@Schema({ timestamps: true })
export class GroupProfile extends Profile {
  constructor(owner: EntityIdentity<User>, obj?: Partial<GroupProfile>) {
    super(owner, obj);
    this.type = ProfileType.Group;
  }
}

export const GroupProfileSchema = SchemaFactory.createForClass(Profile);
