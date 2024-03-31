import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';
import { BaseModel, type PropertiesOf } from '@lyvely/common';
import { VALID_DISPLAY_NAME_REGEX } from '@/validation';
import { pick } from 'lodash';

@Exclude()
export class UpdateProfileMembershipSettings {
  @Expose()
  @IsString()
  @Matches(VALID_DISPLAY_NAME_REGEX)
  displayName: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  constructor(data: PropertiesOf<UpdateProfileMembershipSettings>) {
    BaseModel.init(this, pick(data, ['displayName', 'description']));
  }
}
