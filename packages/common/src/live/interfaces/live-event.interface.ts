import { BaseMembershipRole } from '@/profiles';

export interface ILiveEvent<TData = any> {
  name: string;
  data: TData;
  module: string;
}

export interface ILiveProfileEvent<TData = any> extends ILiveEvent<TData> {
  pid: string;
  roles?: BaseMembershipRole[];
}

export interface ILiveUserEvent<TData = any> extends ILiveEvent<TData> {
  uid: string;
}
