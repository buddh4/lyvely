import {
  CalendarPreferences,
  CreateProfileModel,
  IProfilesService,
  ProfileWithRelationsModel,
  SettingsUpdateResponse,
  UpdateProfileModel,
} from '@lyvely/interface';
import { useSingleton } from '@lyvely/common';
import profileRepository from '@/profiles/repositories/profile.repository';
import { localStorageManager, unwrapAndTransformResponse } from '@/core';

class ProfilesService implements IProfilesService {
  async getProfileByHandle(handle: string): Promise<ProfileWithRelationsModel> {
    const { data } = await profileRepository.getProfileByHandle(handle);
    const profile = new ProfileWithRelationsModel(data);
    if (profile.hasOrg) {
      localStorageManager.set(`profile_oid_${profile.id}`, profile.oid);
    }
    return profile;
  }

  async getProfileById(id: string): Promise<ProfileWithRelationsModel> {
    const { data } = await profileRepository.getProfileById(id);
    const profile = new ProfileWithRelationsModel(data);
    if (profile.hasOrg) {
      localStorageManager.set(`profile_oid_${id}`, profile.oid);
    }
    return profile;
  }

  async getDefaultProfile(): Promise<ProfileWithRelationsModel> {
    const { data } = await profileRepository.getDefaultProfile();
    const profile = new ProfileWithRelationsModel(data);
    if (profile.hasOrg) {
      localStorageManager.set(`profile_oid_${profile.id}`, profile.oid);
    }
    return profile;
  }

  async create(update: CreateProfileModel): Promise<ProfileWithRelationsModel> {
    const { data: relation } = await profileRepository.createProfile(update);
    return new ProfileWithRelationsModel(relation);
  }

  async update(id: string, model: UpdateProfileModel): Promise<ProfileWithRelationsModel> {
    const { data: relation } = await profileRepository.updateProfile(model);
    return new ProfileWithRelationsModel(relation);
  }

  async setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse> {
    return unwrapAndTransformResponse(
      profileRepository.setCalendarPreferences(dto),
      SettingsUpdateResponse,
    );
  }
}

export const useProfileService = useSingleton(() => new ProfilesService());
