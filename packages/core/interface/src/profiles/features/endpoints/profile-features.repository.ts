import { UpdateFeatureModel } from '../models/update-feature.model';
import { IProfileFeaturesClient, API_PROFILE_FEATURES } from './profile-features.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IProfileFeaturesClient>(API_PROFILE_FEATURES);

export default {
  async updateState(model: UpdateFeatureModel, options?: IProfileApiRequestOptions) {
    return api.post<'updateState'>(model, options);
  },
};
