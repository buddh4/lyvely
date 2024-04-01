import { API_PROFILES, IProfilesClient, ProfilesEndpoints } from './profiles.endpoint';
import { useApi } from '@/repository';
import { CreateProfileModel, UpdateProfileModel } from '../models';
import { CalendarPreferences } from '@/common';

const api = useApi<IProfilesClient>(API_PROFILES);

export default {
  async createProfile(model: CreateProfileModel) {
    return api.post<'create'>(model);
  },

  async updateProfile(model: UpdateProfileModel) {
    return api.put<'update'>(ProfilesEndpoints.UPDATE, model);
  },

  async updateAvatar(formData: any) {
    return api.put<'updateAvatar'>(ProfilesEndpoints.UPDATE_AVATAR, formData);
  },

  async getProfileById(id: string) {
    return api.get<'getProfileById'>(id);
  },

  async getProfileByHandle(handle: string) {
    return api.get<'getProfileByHandle'>(ProfilesEndpoints.BY_HANDLE(handle));
  },

  async getDefaultProfile() {
    return api.get<'getDefaultProfile'>();
  },

  async setCalendarPreferences(model: CalendarPreferences) {
    return api.post<'setCalendarPreferences'>(ProfilesEndpoints.SET_CALENDAR_PREFERENCES, model);
  },

  async archive() {
    return api.put<'archive'>(ProfilesEndpoints.ARCHIVE);
  },

  async restore() {
    return api.put<'restore'>(ProfilesEndpoints.RESTORE);
  },
};
