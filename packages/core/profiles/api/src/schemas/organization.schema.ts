import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profiles.schema';
import { EntityIdentity } from '@lyvely/core';
import { User } from '@lyvely/users';
import { ProfileType } from '@lyvely/profiles-interface';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Organization extends Profile {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  oid: mongoose.Types.ObjectId;

  constructor(owner: EntityIdentity<User>, obj?: Partial<Organization>) {
    super(owner, obj);
    this.type = ProfileType.Organization;
    // OID is set in super constructor
    this._id = this.oid;
    this.hasOrg = false;
  }
}

export const OrganizationSchema = SchemaFactory.createForClass(Profile);
