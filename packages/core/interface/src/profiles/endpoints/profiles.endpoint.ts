import { CreateProfileModel, ProfileWithRelationsModel, UpdateProfileModel } from '../models';
import { Endpoint, IEditModelService } from '@lyvely/common';
import { CalendarPreferences } from '@/common';
import { SettingsUpdateResponse } from '@/settings';

export interface IProfilesService
  extends IEditModelService<ProfileWithRelationsModel, CreateProfileModel, UpdateProfileModel> {
  getProfileByHandle(handle: string): Promise<ProfileWithRelationsModel>;
  getProfileById(id: string): Promise<ProfileWithRelationsModel>;
  getDefaultProfile(): Promise<ProfileWithRelationsModel>;
  setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse>;
}

export type ProfilesEndpoint = Endpoint<IProfilesService>;
export const ENDPOINT_PROFILES = 'profiles';
