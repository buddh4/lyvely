import { IProfileFeaturesClient } from './profile-features.endpoint';
import { UpdateFeatureResponseModel, UpdateFeatureModel } from '../models';
import { useSingleton } from '@lyvely/common';
import profileFeaturesRepository from './profile-features.repository';
import { unwrapAndTransformResponse } from '@/endpoints';

class ProfileFeaturesClient implements IProfileFeaturesClient {
  async updateState(model: UpdateFeatureModel): Promise<UpdateFeatureResponseModel> {
    return unwrapAndTransformResponse(
      profileFeaturesRepository.updateState(model),
      UpdateFeatureResponseModel
    );
  }
}

export const useProfileFeaturesClient = useSingleton<ProfileFeaturesClient>(
  () => new ProfileFeaturesClient()
);
