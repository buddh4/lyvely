import { IWebNotification } from '../interfaces';
import { Expose } from 'class-transformer';
import { UrlRoute } from '@/common';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ProfileInfoModel } from '@/profiles';
import { UserInfoModel } from '@/users';

@Expose()
export class WebNotification extends BaseModel<WebNotification> implements IWebNotification {
  id: string;
  type: string;
  body: string;
  seen: boolean;
  title: string;
  sortOrder: number;

  @PropertyType(UrlRoute, { optional: true })
  route?: UrlRoute | null;

  @PropertyType(ProfileInfoModel, { optional: true })
  profileInfo?: ProfileInfoModel;

  @PropertyType(UserInfoModel, { optional: true })
  userInfo?: UserInfoModel;
}
