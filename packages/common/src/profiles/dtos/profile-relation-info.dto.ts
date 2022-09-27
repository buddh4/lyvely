import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@/models';
import { ProfileType } from '../interfaces';
import { BaseUserProfileRelationType, isMultiUserProfile } from "../models";

@Exclude()
export class ProfileRelationSummary {
  @Expose()
  type: string;

  @Expose()
  role?: string;
}

@Exclude()
export class ProfileRelationInfo extends BaseModel<ProfileRelationInfo> {

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  score: number;

  @Expose()
  type: ProfileType;

  @Expose()
  imageHash: string;

  @PropertyType([ProfileRelationSummary])
  relations: ProfileRelationSummary[];

  isMultiUserProfile() {
    return isMultiUserProfile(this.type);
  }

  isMember(role?: string) {
    return !!this.relations.find(
      relation => relation.type === BaseUserProfileRelationType.Membership
        && (!role || relation.role === role));
  }
}

@Exclude()
export class ProfileRelationInfos extends BaseModel<ProfileRelationInfos> {
  @Expose()
  @PropertyType([ProfileRelationInfo])
  profiles: ProfileRelationInfo[];
}
