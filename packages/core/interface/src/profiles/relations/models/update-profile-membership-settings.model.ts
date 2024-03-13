import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH } from '@/users';
import { type PropertiesOf } from '@lyvely/common';

@Exclude()
export class UpdateProfileMembershipSettings {
  @Expose()
  @IsString()
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH)
  displayName: string;

  @Expose()
  @IsString()
  @MaxLength(MAX_USER_NAME_LENGTH)
  @IsOptional()
  description?: string;

  constructor(data: PropertiesOf<UpdateProfileMembershipSettings>) {
    this.displayName = data.displayName;
    this.description = data.description;
  }
}
