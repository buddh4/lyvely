import { Exclude, Expose } from 'class-transformer';
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
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { ProfileMembershipRole } from '@/profiles';

@Exclude()
export class MailInvite {
  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @IsEnum([ProfileMembershipRole.Member, ProfileMembershipRole.Guest])
  @IsOptional()
  role?: ProfileMembershipRole.Member | ProfileMembershipRole.Guest;

  constructor(data: PropertiesOf<MailInvite>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class InvitationRequest {
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

  constructor(data: PropertiesOf<InvitationRequest>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class MailInvitationInfo {
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

  constructor(data: PropertiesOf<MailInvitationInfo>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class UserInvitationInfo {
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

  constructor(data: PropertiesOf<UserInvitationInfo>) {
    BaseModel.init(this, data);
  }
}
