import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from '../../model';
import {
  IProfile,
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
  @IsString()
  description: string;

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

  static create(profile: IProfile, relation: { type: string, role?: string }) {
    return new UserToProfileRelationDto({
      ...profile,
      relationType: relation.type,
      role: relation.role,
    });
  }
}
