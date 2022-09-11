import { Exclude, Expose } from 'class-transformer';
import type { IMembership } from '../interfaces';
import { ProfileRelationDto } from './profile-relation.dto';
import { ProfileDto } from "./profile.dto";

@Exclude()
export class MembershipDto extends ProfileRelationDto<MembershipDto> implements IMembership {
  @Expose()
  readonly role: string;
}

@Exclude()
export class ProfileMembershipDto extends ProfileDto {
  @Expose()
  readonly membership: MembershipDto;

  @Expose()
  readonly relations: ProfileRelationDto[];

  constructor(obj?: Partial<ProfileMembershipDto>) {
    super(obj);
  }
}
