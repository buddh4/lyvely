import { IUrlRoute } from '@lyvely/common';
import { UserInfoModel } from '@/users';
import { ProfileInfoModel } from '@/profiles';

export interface IWebNotification {
  id: string;
  type: string;
  route?: IUrlRoute | null;
  userInfo?: UserInfoModel;
  profileInfo?: ProfileInfoModel;
  sortOrder: number;
  title: string;
  body: string;
  seen: boolean;
}
