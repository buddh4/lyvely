import { UserStatus } from '@/users';

export interface IProfileRelationUserInfo {
  displayName: string;
  guid?: string;
  email?: string;
  description?: string;
}

export interface IProfileRelation<TID = string> {
  oid: TID;
  uid: TID;
  pid: TID;
  userInfo: IProfileRelationUserInfo;
  relationStatus: UserStatus;
  type: string;
  role?: string;
}
