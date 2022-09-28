import repository from "@/repository";
import {
  CreateProfileDto,
  ENDPOINT_PROFILES,
  ProfileWithRelationsDto,
} from "@lyvely/common";

export default {
  async getDefaultProfile() {
    return repository.get<ProfileWithRelationsDto>(
      `${ENDPOINT_PROFILES}/default`
    );
  },

  async createProfile(model: CreateProfileDto) {
    return repository.post<ProfileWithRelationsDto>(
      `${ENDPOINT_PROFILES}`,
      model
    );
  },

  async getProfile(id?: string | null) {
    return id
      ? repository.get<ProfileWithRelationsDto>(`${ENDPOINT_PROFILES}/${id}`)
      : this.getDefaultProfile();
  },
};
