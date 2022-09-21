import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '../../model';
import { IsEnum, IsString, IsOptional, IsArray } from 'class-validator';
import { ProfileType } from '../interfaces';
import { ProfileUsage } from "../models";

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

  @Expose()
  @IsEnum(ProfileType)
  type: ProfileType;

  afterInit() {
    this.type = this.type ?? ProfileType.User;
  }
}
