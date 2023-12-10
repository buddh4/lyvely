import { Expose } from 'class-transformer';
import { ProfileRelationRole } from '@/profiles/relations';
import { IsArray, IsEnum, IsString, Length } from 'class-validator';
import { IProfilePermissionSetting } from '../interfaces';
import { BaseModel } from '@lyvely/common';

@Expose()
export class ProfilePermissionSettingModel<TID = string>
  extends BaseModel<ProfilePermissionSettingModel<any>>
  implements IProfilePermissionSetting<TID>
{
  @Expose()
  @IsString()
  @Length(1, 250)
  id: string;

  @Expose()
  @IsEnum(ProfileRelationRole)
  role: ProfileRelationRole;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  groups?: TID[];
}
