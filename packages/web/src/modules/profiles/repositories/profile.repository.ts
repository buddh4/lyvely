import repository from '@/repository';
import { CreateProfileDto, ENDPOINT_PROFILES, ProfileWithRelationsModel } from '@lyvely/common';

export default {
  async getDefaultProfile() {
    return repository.get<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}/default`);
  },

  async createProfile(model: CreateProfileDto) {
    return repository.post<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}`, model);
  },

  async getProfile(id?: string | null) {
    return id ? repository.get<ProfileWithRelationsModel>(`${ENDPOINT_PROFILES}/${id}`) : this.getDefaultProfile();
  },
};
