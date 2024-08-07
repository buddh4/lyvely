import { Expose } from 'class-transformer';
import { ProfileRelationRole, IProfilePermissionSetting } from '../interfaces';
import { IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { BaseModel } from '@lyvely/common';

@Expose()
export class ProfilePermissionSettingModel<TID = string> implements IProfilePermissionSetting<TID> {
  @Expose()
  @IsString()
  @Length(1, 250)
  id: string;

  @Expose()
  @IsEnum(ProfileRelationRole)
  role: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  groups?: TID[];

  constructor(data: ProfilePermissionSettingModel<any>) {
    BaseModel.init(this, data);
  }
}
