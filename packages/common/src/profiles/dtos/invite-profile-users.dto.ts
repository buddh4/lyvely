import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseModel, PropertyType } from '@/models';
import { BaseMembershipRole } from '../models';

@Exclude()
export class ProfileMemberMailInvite extends BaseModel<ProfileMemberMailInvite> {
  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  @IsOptional()
  @PropertyType(String, { default: BaseMembershipRole.Member })
  role?: string;
}

@Exclude()
export class InviteProfileMembers {
  @Expose()
  @IsArray()
  @Type(() => ProfileMemberMailInvite)
  @PropertyType([ProfileMemberMailInvite])
  @ValidateNested()
  invites: ProfileMemberMailInvite[];
}
