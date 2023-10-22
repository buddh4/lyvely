import { ProfileMembershipRole } from '@/profiles';

export interface ILiveEvent {
  name: string;
  module: string;
}

export interface ILiveProfileEvent extends ILiveEvent {
  pid: string;
  roles?: ProfileMembershipRole[];
}

export interface ILiveUserEvent extends ILiveEvent {
  uid: string;
}
