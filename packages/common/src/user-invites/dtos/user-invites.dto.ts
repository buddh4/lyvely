import { Exclude, Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PropertyType } from '@/models';
import { BaseMembershipRole } from '@/profiles';

@Exclude()
export class UserInvite {
  @Expose()
  @IsString()
  @IsOptional()
  @PropertyType(String, { default: BaseMembershipRole.Member })
  role?: string;
}

@Exclude()
export class MailInvite extends UserInvite {
  @Expose()
  @IsString()
  @IsEmail()
  email: string;
}

@Exclude()
export class UserInvites {
  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => MailInvite)
  @PropertyType(MailInvite)
  @ValidateNested()
  invites: MailInvite[];

  @Expose()
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  pids?: string[];
}
