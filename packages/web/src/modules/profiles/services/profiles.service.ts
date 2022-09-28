import {
  CreateProfileDto,
  IProfilesEndpoint,
  ProfileWithRelationsDto,
  useSingleton,
} from "@lyvely/common";
import profileRepository from "@/modules/profiles/repositories/profile.repository";

class ProfilesService implements IProfilesEndpoint {
  async getProfile(id: string): Promise<ProfileWithRelationsDto> {
    const { data } = await profileRepository.getProfile(id);
    return new ProfileWithRelationsDto(data);
  }

  async create(dto: CreateProfileDto): Promise<ProfileWithRelationsDto> {
    const { data: relation } = await profileRepository.createProfile(dto);
    return new ProfileWithRelationsDto(relation);
  }
}

export const useProfileService = useSingleton(() => new ProfilesService());
