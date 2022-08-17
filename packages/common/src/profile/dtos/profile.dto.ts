import { Exclude, Expose, Type } from 'class-transformer';
import { DocumentDto } from '../../model';
import { IProfile, ProfileType, ProfileVisibilityLevel } from '../interfaces';
import { IsArray, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { CategoryDto, ICategory } from '../../category';

@Exclude()
export class ProfileDto extends DocumentDto<ProfileDto> implements IProfile {

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsInt()
  @Min(0)
  score: number;

  @Expose()
  @IsEnum(ProfileType)
  type: number;

  @Expose()
  @IsEnum(ProfileVisibilityLevel)
  visibility: number;

  @Expose()
  @IsString()
  locale: string;

  @Expose()
  @Type(() => CategoryDto)
  @IsArray()
  tags: ICategory[];
}