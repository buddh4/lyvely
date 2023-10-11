import { repository } from '@/core';
import {
  CreateProfileModel,
  ENDPOINT_PROFILES,
  ProfileWithRelationsModel,
} from '@lyvely/core-interface';

export default {
  async getDefaultProfile() {
    return repository.get<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}/default`);
  },

  async createProfile(model: CreateProfileModel) {
    return repository.post<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}`, model);
  },

  async getProfile(id?: string | null) {
    return id
      ? repository.get<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}/${id}`)
      : this.getDefaultProfile();
  },
};
