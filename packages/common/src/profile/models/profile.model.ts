import { Exclude, Expose, Type } from 'class-transformer';
import { DocumentModel } from '../../model';
import { ProfileType, ProfileVisibilityLevel } from '../interfaces';
import { IsArray, IsEnum, IsInt, IsString, Min, IsOptional, Length } from 'class-validator';
import { TagModel } from '../../tags';
import { PropertiesOf } from "../../util";

export const MIN_PROFILE_NAME_LENGTH = 1;
export const MAX_PROFILE_NAME_LENGTH = 100;

export const MAX_PROFILE_DESCRIPTION_LENGTH = 200;

@Exclude()
export class ProfileModel extends DocumentModel<ProfileModel> {

  @Expose()
  @IsString()
  @Length(MIN_PROFILE_NAME_LENGTH, MAX_PROFILE_NAME_LENGTH)
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsInt()
  @Min(0)
  score: number;

  @Expose()
  @IsEnum(ProfileType)
  type: ProfileType;

  @Expose()
  @IsEnum(ProfileVisibilityLevel)
  visibility: number;

  @Expose()
  @IsString()
  locale: string;

  @Expose()
  @IsString()
  @IsOptional()
  imageHash?: string;

  @Expose()
  @Type(() => TagModel)
  @IsArray()
  tags: TagModel[];
}
