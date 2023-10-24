import { StrictEndpoint } from '@lyvely/common';
import { UpdateFeatureResponseModel, UpdateFeatureModel } from '../models';

export interface IProfileFeaturesService {
  updateState(model: UpdateFeatureModel): Promise<UpdateFeatureResponseModel>;
}

export type ProfileFeaturesEndpoint = StrictEndpoint<IProfileFeaturesService>;
export const ENDPOINT_PROFILE_FEATURES = 'profile-features';
