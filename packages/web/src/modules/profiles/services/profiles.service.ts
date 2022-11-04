import { CreateProfileDto, IProfilesService, ProfileWithRelationsModel, useSingleton } from '@lyvely/common';
import profileRepository from '@/modules/profiles/repositories/profile.repository';

class ProfilesService implements IProfilesService {
  async getProfile(id: string): Promise<ProfileWithRelationsModel> {
    const { data } = await profileRepository.getProfile(id);
    return new ProfileWithRelationsModel(data);
  }

  async create(dto: CreateProfileDto): Promise<ProfileWithRelationsModel> {
    const { data: relation } = await profileRepository.createProfile(dto);
    return new ProfileWithRelationsModel(relation);
  }
}

export const useProfileService = useSingleton(() => new ProfilesService());
