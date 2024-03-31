import { Exclude, Expose } from 'class-transformer';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  Length,
  IsNumber,
  Matches,
  IsMongoId,
} from 'class-validator';
import { ProfileType, ProfileUsage, ProfileVisibilityLevel } from '../interfaces';
import {
  MAX_PROFILE_DESCRIPTION_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  MIN_PROFILE_NAME_LENGTH,
} from '../profiles.constants';
import { VALID_DISPLAY_NAME_REGEX } from '@/validation';

@Exclude()
export class CreateProfileModel {
  @Expose()
  @IsString()
  @Length(MIN_PROFILE_NAME_LENGTH, MAX_PROFILE_NAME_LENGTH)
  @Matches(VALID_DISPLAY_NAME_REGEX)
  name: string;

  @Expose()
  @IsMongoId()
  @IsOptional()
  oid?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Length(0, MAX_PROFILE_DESCRIPTION_LENGTH)
  description?: string;

  @Expose()
  @IsArray()
  @IsEnum(ProfileUsage, { each: true })
  usage: ProfileUsage[] = [];

  @Expose()
  @IsNumber()
  @IsEnum(ProfileVisibilityLevel)
  @PropertyType(Number, { default: ProfileVisibilityLevel.Member })
  visibility: ProfileVisibilityLevel;

  @Expose()
  @IsEnum(ProfileType)
  @PropertyType(String, { default: ProfileType.User })
  type: ProfileType;

  constructor(data?: PropertiesOf<CreateProfileModel>) {
    BaseModel.init(this, data);
  }
}
