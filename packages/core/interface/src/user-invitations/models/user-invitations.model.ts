import { Exclude, Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ProfileMembershipRole } from '@/profiles';

@Exclude()
export class MailInvite extends BaseModel<MailInvite> {
  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @IsEnum([ProfileMembershipRole.Member, ProfileMembershipRole.Guest])
  @IsOptional()
  role?: ProfileMembershipRole.Member | ProfileMembershipRole.Guest;
}

@Exclude()
export class InvitationRequest extends BaseModel<InvitationRequest> {
  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @PropertyType(MailInvite)
  @ValidateNested()
  invites: MailInvite[];

  @Expose()
  @IsMongoId()
  @IsOptional()
  pid?: string;
}

@Exclude()
export class MailInvitationInfo extends BaseModel<MailInvitationInfo> {
  @Expose()
  email: string;

  @Expose()
  pid?: string;

  @Expose()
  profileName?: string;

  @Expose()
  profileGuid?: string;

  @Expose()
  hostName: string;

  @Expose()
  hostGuid: string;

  @Expose()
  hostId: string;

  @Expose()
  isVerifiedMail: boolean;
}

@Exclude()
export class UserInvitationInfo extends BaseModel<UserInvitationInfo> {
  @Expose()
  pid: string;

  @Expose()
  profileName: string;

  @Expose()
  profileGuid?: string;

  @Expose()
  hostId: string;

  @Expose()
  hostName: string;

  @Expose()
  hostGuid: string;
}
