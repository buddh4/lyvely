import {
  CalendarPreferences,
  CreateProfileModel,
  ENDPOINT_PROFILES,
  IProfilesService,
  UpdateProfileModel,
  useApiRepository,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async createProfile(model: CreateProfileModel) {
    return useApiRepository().post<EndpointResult<IProfilesService['create']>>(
      `${ENDPOINT_PROFILES}`,
      model,
    );
  },

  async updateProfile(model: UpdateProfileModel) {
    return useApiRepository().put<EndpointResult<IProfilesService['update']>>(
      `${ENDPOINT_PROFILES}`,
      model,
    );
  },

  async getProfileById(id: string) {
    return useApiRepository().get<EndpointResult<IProfilesService['getProfileById']>>(
      `${ENDPOINT_PROFILES}/${id}`,
    );
  },

  async getProfileByHandle(handle: string) {
    return useApiRepository().get<EndpointResult<IProfilesService['getProfileByHandle']>>(
      `${ENDPOINT_PROFILES}/by-handle/${handle}`,
    );
  },

  async getDefaultProfile() {
    return useApiRepository().get<EndpointResult<IProfilesService['getDefaultProfile']>>(
      `${ENDPOINT_PROFILES}`,
    );
  },

  async setCalendarPreferences(model: CalendarPreferences) {
    return useApiRepository().post<EndpointResult<IProfilesService['setCalendarPreferences']>>(
      `${ENDPOINT_PROFILES}/set-calendar-preferences`,
      model,
    );
  },
};
