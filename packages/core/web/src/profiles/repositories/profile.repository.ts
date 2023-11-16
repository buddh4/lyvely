import { repository } from '@/core';
import {
  CalendarPreferences,
  CreateProfileModel,
  ENDPOINT_PROFILES,
  IProfilesService,
  UpdateProfileModel,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async createProfile(model: CreateProfileModel) {
    return repository.post<EndpointResult<IProfilesService['create']>>(
      `${ENDPOINT_PROFILES}`,
      model,
    );
  },

  async updateProfile(model: UpdateProfileModel) {
    return repository.put<EndpointResult<IProfilesService['update']>>(
      `${ENDPOINT_PROFILES}`,
      model,
    );
  },

  async getProfileById(id: string) {
    return repository.get<EndpointResult<IProfilesService['getProfileById']>>(
      `${ENDPOINT_PROFILES}/${id}`,
    );
  },

  async getProfileByHandle(handle: string) {
    return repository.get<EndpointResult<IProfilesService['getProfileByHandle']>>(
      `${ENDPOINT_PROFILES}/by-handle/${handle}`,
    );
  },

  async getDefaultProfile() {
    return repository.get<EndpointResult<IProfilesService['getDefaultProfile']>>(
      `${ENDPOINT_PROFILES}`,
    );
  },

  async setCalendarPreferences(model: CalendarPreferences) {
    return repository.post<EndpointResult<IProfilesService['setCalendarPreferences']>>(
      `${ENDPOINT_PROFILES}/set-calendar-preferences`,
      model,
    );
  },
};
