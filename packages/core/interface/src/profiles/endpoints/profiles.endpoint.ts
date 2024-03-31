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
}

export type ProfilesEndpoint = Endpoint<IProfilesClient>;
export const API_PROFILES = 'profiles';

export const ProfilesEndpoints = {
  BY_HANDLE: (handle: string) => `by-handle/${handle}`,
  UPDATE: ':pid',
  UPDATE_AVATAR: ':pid/avatar',
  SET_CALENDAR_PREFERENCES: 'set-calendar-preferences',
};
