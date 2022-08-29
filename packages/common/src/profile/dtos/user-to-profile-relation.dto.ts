import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from '../../model';
import {
  IUserToProfileRelation,
  ProfileType,
} from '../interfaces';
import { IsEnum, IsInt, IsString, Min, IsOptional } from 'class-validator';


@Exclude()
export class UserToProfileRelationDto extends BaseDto<UserToProfileRelationDto> implements IUserToProfileRelation {

  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsInt()
  @Min(0)
  score: number;

  @Expose()
  @IsEnum(ProfileType)
  type: ProfileType;

  @Expose()
  @IsString()
  @IsOptional()
  imageHash: string;

  @Expose()
  @IsString()
  relationType: string;

  @Expose()
  @IsString()
  @IsOptional()
  role?: string;
}
