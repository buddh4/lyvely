import { Exclude, Expose, Type } from 'class-transformer';
import { DocumentDto } from '../../model';
import { IProfile, ProfileType, ProfileVisibilityLevel } from '../interfaces';
import { IsArray, IsEnum, IsInt, IsString, Min, IsOptional } from 'class-validator';
import { TagDto, ITag } from '../../tags';

@Exclude()
export class ProfileDto extends DocumentDto<ProfileDto> implements IProfile {

  @Expose()
  @IsString()
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
  type: number;

  @Expose()
  @IsEnum(ProfileVisibilityLevel)
  visibility: number;

  @Expose()
  @IsString()
  locale: string;

  @Expose()
  @IsString()
  @IsOptional()
  imageHash: string;

  @Expose()
  @Type(() => TagDto)
  @IsArray()
  tags: ITag[];
}
