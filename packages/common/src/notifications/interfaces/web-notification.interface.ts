import { UrlRoute } from '@/web';
import { UserInfoModel } from '@/users';
import { ProfileInfoModel } from '@/profiles';

export interface IWebNotification {
  id: string;
  type: string;
  route?: UrlRoute;
  userInfo?: UserInfoModel;
  profileInfo?: ProfileInfoModel;
  sortOrder: number;
  title: string;
  body: string;
  seen: boolean;
}
