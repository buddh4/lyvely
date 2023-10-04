import { IUrlRoute } from '@lyvely/common';
import { UserInfoModel } from '@lyvely/users-interface';
import { ProfileInfoModel } from '@lyvely/profiles-interface';

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
