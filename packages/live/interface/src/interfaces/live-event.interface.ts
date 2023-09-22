import { BaseMembershipRole } from '@lyvely/profiles';

export interface ILiveEvent {
  name: string;
  module: string;
}

export interface ILiveProfileEvent extends ILiveEvent {
  pid: string;
  roles?: BaseMembershipRole[];
}

export interface ILiveUserEvent extends ILiveEvent {
  uid: string;
}
