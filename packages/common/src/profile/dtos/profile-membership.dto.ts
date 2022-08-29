import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from '../../model';
import type { IMembership } from '../interfaces/profile-membership.interface';
import type { IProfile } from '../interfaces';
import { ProfileRelationDto } from './profile-relation.dto';
import { ProfileDto } from "./profile.dto";

@Exclude()
export class MembershipDto extends ProfileRelationDto<MembershipDto> {
  @Expose()
  readonly role: string;
}

@Exclude()
export class ProfileMembershipDto extends ProfileDto {
  @Expose()
  readonly membership: IMembership;

  constructor(obj?: Partial<ProfileMembershipDto>) {
    super(obj);
  }
}
