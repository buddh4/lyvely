import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from '../../model';
import type { IMembership } from '../interfaces/profile-membership.interface';
import type { IProfile } from '../interfaces';
import { ProfileRelationDto } from './profile-relation.dto';

@Exclude()
export class MembershipDto extends ProfileRelationDto<MembershipDto> {
  @Expose()
  readonly role: string;
}

@Exclude()
export class ProfileMembershipDto extends BaseDto<ProfileMembershipDto> {
  @Expose()
  readonly membership: IMembership;

  @Expose()
  readonly profile: IProfile;
}
