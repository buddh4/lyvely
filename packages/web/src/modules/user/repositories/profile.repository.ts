import repository from "@/repository";
import { CategoryDto , ProfileMembershipDto } from '@lyvely/common';
const resource = "profiles";

export default {
  getDefaultProfile() {
    return repository.get<ProfileMembershipDto>(`${resource}/default`);
  },

  getProfile(id?: string|null) {
    return id
      ? repository.get<ProfileMembershipDto>(`${resource}/${id}`)
      : this.getDefaultProfile();
  },

  async getCategories(profile: string) {
    return repository.get<{categories: CategoryDto[]}>(`${resource}/${profile}/categories`);
  }
};
