import { UpdateFeatureModel } from '../models';
import { IProfileFeaturesClient, API_PROFILE_FEATURES } from './profile-features.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IProfileFeaturesClient>(API_PROFILE_FEATURES);

export default {
  async updateState(model: UpdateFeatureModel, options?: IProfileApiRequestOptions) {
    return api.post<'updateState'>(API_PROFILE_FEATURES, model, options);
  },
};
