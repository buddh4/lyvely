import { IUrlRoute } from '@/web';
import { UserInfoModel } from '@lyvely/users';
import { ProfileInfoModel } from '@lyvely/profiles';

export interface IWebNotification {
  id: string;
  type: string;
  route?: IUrlRoute;
  userInfo?: UserInfoModel;
  profileInfo?: ProfileInfoModel;
  sortOrder: number;
  title: string;
  body: string;
  seen: boolean;
}
