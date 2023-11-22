import { IProfilesClient } from './profiles.endpoint';
import { CreateProfileModel, ProfileWithRelationsModel, UpdateProfileModel } from '../models';
import { useSingleton } from '@lyvely/common';
import profileRepository from './profiles.repository';
import { unwrapAndTransformResponse } from '@/endpoints';
import { SettingsUpdateResponse } from '@/settings';
import { CalendarPreferences } from '@/common';

class ProfilesClient implements IProfilesClient {
  async getProfileByHandle(handle: string): Promise<ProfileWithRelationsModel> {
    return unwrapAndTransformResponse(
      profileRepository.getProfileByHandle(handle),
      ProfileWithRelationsModel,
    );
  }

  async getProfileById(id: string): Promise<ProfileWithRelationsModel> {
    return unwrapAndTransformResponse(
      profileRepository.getProfileById(id),
      ProfileWithRelationsModel,
    );
  }

  async getDefaultProfile(): Promise<ProfileWithRelationsModel> {
    return unwrapAndTransformResponse(
      profileRepository.getDefaultProfile(),
      ProfileWithRelationsModel,
    );
  }

  async create(update: CreateProfileModel): Promise<ProfileWithRelationsModel> {
    return unwrapAndTransformResponse(
      profileRepository.createProfile(update),
      ProfileWithRelationsModel,
    );
  }

  async update(id: string, model: UpdateProfileModel): Promise<ProfileWithRelationsModel> {
    return unwrapAndTransformResponse(
      profileRepository.updateProfile(model),
      ProfileWithRelationsModel,
    );
  }

  async setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse> {
    return unwrapAndTransformResponse(
      profileRepository.setCalendarPreferences(dto),
      SettingsUpdateResponse,
    );
  }
}

export const useProfilesClient = useSingleton(() => new ProfilesClient());
