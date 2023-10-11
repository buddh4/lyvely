import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH } from '@/users';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class UpdateProfileMembershipSettings extends BaseModel<UpdateProfileMembershipSettings> {
  @Expose()
  @IsString()
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH)
  displayName: string;

  @Expose()
  @IsString()
  @MaxLength(MAX_USER_NAME_LENGTH)
  @IsOptional()
  description?: string;
}