import { CreateProfileModel, ProfileWithRelationsModel, UpdateProfileModel } from '../models';
import { Endpoint } from '@/endpoints';
import { IEditModelClient, CalendarPreferences } from '@/common';
import { SettingsUpdateResponse } from '@/settings';

export interface IProfilesClient
  extends IEditModelClient<ProfileWithRelationsModel, CreateProfileModel, UpdateProfileModel> {
  getProfileByHandle(handle: string): Promise<ProfileWithRelationsModel>;
  getProfileById(id: string): Promise<ProfileWithRelationsModel>;
  getDefaultProfile(): Promise<ProfileWithRelationsModel>;
  setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse>;
}

export type ProfilesEndpoint = Endpoint<IProfilesClient>;
export const ENDPOINT_PROFILES = 'profiles';

export const ProfilesEndpointPaths = {
  BY_HANDLE: (handle: string) => `by-handle/${handle}`,
  SET_CALENDAR_PREFERENCES: 'set-calendar-preferences',
};
