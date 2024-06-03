import { CreateProfileModel, UpdateProfileModel, ProfileWithRelationsModel } from '../models';
import { Endpoint } from '@/endpoints';
import { IEditModelClient, CalendarPreferences } from '@/common';
import { SettingsUpdateResponse } from '@/settings';
import type { IUpdateAvatarClient } from '../../avatars';

export interface IProfilesClient
  extends IEditModelClient<ProfileWithRelationsModel, CreateProfileModel, UpdateProfileModel>,
    IUpdateAvatarClient {
  getProfileByHandle(handle: string): Promise<ProfileWithRelationsModel>;
  getProfileById(id: string): Promise<ProfileWithRelationsModel>;
  getDefaultProfile(): Promise<ProfileWithRelationsModel>;
  setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse>;
  archive(): Promise<void>;
  restore(): Promise<void>;
}

export type ProfilesEndpoint = Endpoint<IProfilesClient>;
export const API_PROFILES = 'profiles';

export const ProfilesEndpoints = {
  BY_HANDLE: (handle: string) => `by-handle/${handle}`,
  UPDATE: ':pid',
  ARCHIVE: ':pid/archive',
  RESTORE: ':pid/restore',
  UPDATE_AVATAR: ':pid/avatar',
  SET_CALENDAR_PREFERENCES: ':pid/set-calendar-preferences',
};
