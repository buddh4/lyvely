import { IWebNotification } from '../interfaces';
import { Expose, Type } from 'class-transformer';
import { BaseModel } from '@lyvely/common';
import { ProfileInfoModel } from '@lyvely/profiles';
import { UserInfoModel } from '@lyvely/users';
import { UrlRoute } from '@/web';

@Expose()
export class WebNotification extends BaseModel<WebNotification> implements IWebNotification {
  id: string;
  type: string;
  body: string;
  seen: boolean;
  title: string;
  sortOrder: number;

  @Type(() => UrlRoute)
  route?: UrlRoute;

  @Type(() => ProfileInfoModel)
  profileInfo?: ProfileInfoModel;

  @Type(() => UserInfoModel)
  userInfo?: UserInfoModel;
}
