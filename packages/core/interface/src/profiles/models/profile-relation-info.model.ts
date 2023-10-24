import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ProfileType, BaseUserProfileRelationType } from '../interfaces';
import { ProfileModel } from './profile.model';

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
  guid: string;

  @PropertyType([ProfileRelationSummary])
  relations: ProfileRelationSummary[];

  isMultiUserProfile() {
    return isMultiUserProfile(this.type);
  }

  isMember(role?: string) {
    return !!this.relations.find(
      (relation) =>
        relation.type === BaseUserProfileRelationType.Membership &&
        (!role || relation.role === role),
    );
  }
}

@Exclude()
export class ProfileRelationInfos extends BaseModel<ProfileRelationInfos> {
  @Expose()
  @PropertyType([ProfileRelationInfo])
  profiles: ProfileRelationInfo[];
}

const multiUserProfiles = [ProfileType.Group, ProfileType.Organization];

export function isMultiUserProfile(modelOrType?: ProfileModel | ProfileType): boolean {
  const type = modelOrType instanceof ProfileModel ? modelOrType.type : modelOrType;
  return !!type && multiUserProfiles.includes(type);
}
