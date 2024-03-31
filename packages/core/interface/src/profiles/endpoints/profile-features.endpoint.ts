import { StrictEndpoint, profileApiPrefix } from '@/endpoints';
import { UpdateFeatureResponseModel, UpdateFeatureModel } from '../models';

export interface IProfileFeaturesClient {
  updateState(model: UpdateFeatureModel): Promise<UpdateFeatureResponseModel>;
}

export type ProfileFeaturesEndpoint = StrictEndpoint<IProfileFeaturesClient>;
export const API_PROFILE_FEATURES = profileApiPrefix('features');
