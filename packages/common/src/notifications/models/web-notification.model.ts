import { IWebNotification } from '../interfaces';
import { Expose, Type } from 'class-transformer';
import { BaseModel } from '@/models';
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

  @Type(() => ProfileInfoModel)
  profileInfo?: ProfileInfoModel;

  @Type(() => UserInfoModel)
  userInfo?: UserInfoModel;
}
