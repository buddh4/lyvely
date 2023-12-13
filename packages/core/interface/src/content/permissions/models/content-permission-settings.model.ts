import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsString, Length } from 'class-validator';
import { ContentUserRole, IContentPermissionSetting } from '../interfaces';
import { BaseModel } from '@lyvely/common';

@Expose()
export class ContentPermissionSettingModel<TID = string>
  extends BaseModel<ContentPermissionSettingModel<any>>
  implements IContentPermissionSetting<TID>
{
  @Expose()
  @IsString()
  @Length(1, 250)
  id: string;

  @Expose()
  @IsEnum(ContentUserRole)
  role: ContentUserRole;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  groups?: TID[];
}
