import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '../../model';
import {
  IUserToProfileRelation,
  ProfileType,
} from '../interfaces';
import { IsEnum, IsInt, IsString, Min, IsOptional } from 'class-validator';
import { PropertiesOf } from "../../util";
import { ProfileModel } from "../models";


@Exclude()
export class UserToProfileRelationDto extends BaseModel<UserToProfileRelationDto> implements IUserToProfileRelation {

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

  static create(profile: PropertiesOf<ProfileModel>, relation: { type: string, role?: string }) {
    return new UserToProfileRelationDto({
      ...profile,
      relationType: relation.type,
      role: relation.role,
    });
  }
}
