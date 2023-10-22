import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
import { IsEnum, IsString, IsOptional, IsArray, Length } from 'class-validator';
import { ProfileType, ProfileUsage } from '../interfaces';
import {
  MAX_PROFILE_DESCRIPTION_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  MIN_PROFILE_NAME_LENGTH,
} from '../profiles.constants';

@Exclude()
export class CreateProfileModel extends BaseModel<CreateProfileModel> {
  @Expose()
  @IsString()
  @Length(MIN_PROFILE_NAME_LENGTH, MAX_PROFILE_NAME_LENGTH)
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Length(0, MAX_PROFILE_DESCRIPTION_LENGTH)
  description: string;

  @Expose()
  @IsArray()
  @IsEnum(ProfileUsage, { each: true })
  usage: ProfileUsage[] = [];

  /*@Expose()
  @IsString()
  @IsEnum(ProfileVisibilityLevel)
  @PropertyType(Number, { default: ProfileVisibilityLevel.Member })
  visibility: ProfileVisibilityLevel;*/

  @Expose()
  @IsEnum(ProfileType)
  @PropertyType(String, { default: ProfileType.User })
  type: ProfileType;
}
