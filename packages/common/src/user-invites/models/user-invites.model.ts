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
import { BaseModel, PropertyType } from '@/models';

@Exclude()
export class MailInvite extends BaseModel<MailInvite> {
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
  @IsMongoId()
  @IsOptional()
  pid?: string;
}
