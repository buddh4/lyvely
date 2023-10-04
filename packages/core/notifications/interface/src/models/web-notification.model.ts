import { IWebNotification } from '../interfaces';
import { Expose, Type } from 'class-transformer';
import { BaseModel, UrlRoute } from '@lyvely/common';
import { ProfileInfoModel } from '@lyvely/profiles-interface';
import { UserInfoModel } from '@lyvely/users-interface';

@Expose()
export class WebNotification extends BaseModel<WebNotification> implements IWebNotification {
  id: string;
  type: string;
  body: string;
  seen: boolean;
  title: string;
  sortOrder: number;

  @Type(() => UrlRoute)
  route?: UrlRoute | null;

  @Type(() => ProfileInfoModel)
  profileInfo?: ProfileInfoModel;

  @Type(() => UserInfoModel)
  userInfo?: UserInfoModel;
}
