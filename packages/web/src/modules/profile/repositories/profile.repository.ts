import repository from "@/repository";
import { TagDto , ProfileMembershipDto, CreateProfileDto, ProfileDto } from '@lyvely/common';
const resource = "profiles";

export default {
  async getDefaultProfile() {
    return repository.get<ProfileMembershipDto>(`${resource}/default`);
  },

  async createProfile(model: CreateProfileDto) {
    return repository.post<ProfileDto>(`${resource}`, model)
  },

  async getProfile(id?: string|null) {
    return id
      ? repository.get<ProfileMembershipDto>(`${resource}/${id}`)
      : this.getDefaultProfile();
  },

  async getTags(profile: string) {
    return repository.get<{categories: TagDto[]}>(`${resource}/${profile}/categories`);
  }
};
