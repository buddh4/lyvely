import {
  CreateProfileModel,
  IProfilesService,
  ProfileWithRelationsModel,
} from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import profileRepository from '@/profiles/repositories/profile.repository';
import { localStorageManager } from '@/core';

class ProfilesService implements IProfilesService {
  async getProfile(id: string): Promise<ProfileWithRelationsModel> {
    const { data } = await profileRepository.getProfile(
      id,
      localStorageManager.get(`profile_oid_${id}`),
    );
    const profile = new ProfileWithRelationsModel(data);
    if (profile.hasOrg) {
      localStorageManager.set(`profile_oid_${id}`, profile.oid);
    }
    return profile;
  }

  async create(dto: CreateProfileModel): Promise<ProfileWithRelationsModel> {
    const { data: relation } = await profileRepository.createProfile(dto);
    return new ProfileWithRelationsModel(relation);
  }
}

export const useProfileService = useSingleton(() => new ProfilesService());
