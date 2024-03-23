import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './profiles.schema';
import { User } from '@/users';
import { ProfileType } from '@lyvely/interface';

@Schema({ timestamps: true })
export class Organization extends Profile {
  constructor(owner: User, obj?: Partial<Organization>) {
    super(owner, obj);
    this.type = ProfileType.Organization;
    // OID is set in super constructor
    this._id = this.oid;
    this.hasOrg = false;
  }
}

export const OrganizationSchema = SchemaFactory.createForClass(Profile);
