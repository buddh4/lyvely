import { Expose } from 'class-transformer';
import { ProfileRelationRole } from '@/profiles/relations';
import { IsArray, IsEnum, IsString, Length } from 'class-validator';
import { IProfilePermissionSetting } from '../interfaces';

@Expose()
export class ProfilePermissionSettingModel<TID = string> implements IProfilePermissionSetting<TID> {
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
