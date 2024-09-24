import { ProfileRoleLevel } from '@/profiles';
import { UserRoleLevel } from '@/permissions';
import { ContentUserRoleLevel } from '@/content/permissions';

export interface ILiveEvent {
  name: string;
  module: string;
  visibility?: number;
}

export interface IGlobalLiveEvent extends ILiveEvent {
  name: string;
  module: string;
  visibility?: UserRoleLevel;
}

export interface ILiveProfileEvent extends ILiveEvent {
  pid: string;
  visibility?: ProfileRoleLevel;
}

export interface ILiveContentEvent extends ILiveEvent {
  cid: string;
  pid: string;
  visibility?: ContentUserRoleLevel;
}

export interface ILiveUserEvent extends ILiveEvent {
  uid: string;
}
