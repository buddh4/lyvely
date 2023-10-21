import {
  IProfileFeaturesService,
  UpdateFeatureModel,
  UpdateFeatureResponseModel,
} from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import profileFeaturesRepository from '@/profiles/repositories/profile-features.repository';
import { unwrapAndTransformResponse } from '@/core';

class ProfileFeaturesService implements IProfileFeaturesService {
  async updateState(model: UpdateFeatureModel): Promise<UpdateFeatureResponseModel> {
    return unwrapAndTransformResponse(
      profileFeaturesRepository.updateState(model),
      UpdateFeatureResponseModel,
    );
  }
}

export const useProfileFeaturesService = useSingleton<ProfileFeaturesService>(
  () => new ProfileFeaturesService(),
);
