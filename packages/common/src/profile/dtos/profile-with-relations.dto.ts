import { Exclude, Expose } from 'class-transformer';
import type { IMembership } from '../interfaces';
import { ProfileRelationDto } from './profile-relation.dto';
import { ProfileModel } from "../models";
import { PropertyType } from "../../model";

@Exclude()
export class MembershipDto extends ProfileRelationDto<MembershipDto> implements IMembership {
  @Expose()
  readonly role: string;
}

@Exclude()
export class ProfileWithRelationsDto extends ProfileModel {
  @Expose()
  @PropertyType([ProfileRelationDto])
  readonly relations: ProfileRelationDto[];

  constructor(obj?: Partial<ProfileWithRelationsDto>) {
    super(obj);
  }
}
