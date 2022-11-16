import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@/models';
import { IsEnum, IsString, IsOptional, IsArray } from 'class-validator';
import { ProfileType } from '../interfaces';
import { ProfileUsage } from '../models';

@Exclude()
export class CreateProfileDto extends BaseModel<CreateProfileDto> {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description: string;

  @Expose()
  @IsArray()
  @IsEnum(ProfileUsage, { each: true })
  usage: ProfileUsage[];

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
