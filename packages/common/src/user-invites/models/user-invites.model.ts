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
import { BaseModel, PropertyType } from '@/models';
import { BaseProfileRelationRole } from '@/profiles';

@Exclude()
export class MailInvite extends BaseModel<MailInvite> {
  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @IsEnum([BaseProfileRelationRole.Member, BaseProfileRelationRole.Guest])
  role?: BaseProfileRelationRole.Member | BaseProfileRelationRole.Guest;
}

@Exclude()
export class UserInvites extends BaseModel<UserInvites> {
  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => MailInvite)
  @PropertyType(MailInvite)
  @ValidateNested()
  invites: MailInvite[];

  @Expose()
  @IsMongoId()
  @IsOptional()
  pid?: string;
}
