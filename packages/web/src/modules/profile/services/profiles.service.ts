import { CreateProfileDto, IProfilesEndpoint, ProfileWithRelationsDto } from "@lyvely/common";
import profileRepository from "@/modules/profile/repositories/profile.repository";
import { useSingleton } from "@lyvely/common";

class ProfilesService implements IProfilesEndpoint  {
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
