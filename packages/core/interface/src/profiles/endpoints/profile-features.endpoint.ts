import { StrictEndpoint } from '@lyvely/common';
import { UpdateFeatureResponseModel, UpdateFeatureModel } from '../models';

export interface IProfileFeaturesClient {
  updateState(model: UpdateFeatureModel): Promise<UpdateFeatureResponseModel>;
}

export type ProfileFeaturesEndpoint = StrictEndpoint<IProfileFeaturesClient>;
export const ENDPOINT_PROFILE_FEATURES = 'profile-features';
