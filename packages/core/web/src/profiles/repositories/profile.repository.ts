import { repository } from '@/core';
import {
  CreateProfileModel,
  ENDPOINT_PROFILES,
  ProfileWithRelationsModel,
  UpdateProfileModel,
} from '@lyvely/core-interface';

export default {
  async createProfile(model: CreateProfileModel) {
    return repository.post<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}`, model);
  },

  async updateProfile(model: UpdateProfileModel) {
    return repository.put<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}`, model);
  },

  async getProfileById(id: string) {
    return repository.get<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}/${id}`);
  },

  async getProfileByHandle(handle: string) {
    return repository.get<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}/by-handle/${handle}`);
  },

  async getDefaultProfile() {
    return repository.get<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}`);
  },
};
