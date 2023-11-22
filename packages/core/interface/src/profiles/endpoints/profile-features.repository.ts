import { UpdateFeatureModel } from '../models';
import { IProfileFeaturesClient, ENDPOINT_PROFILE_FEATURES } from './profile-features.endpoint';
import { useApi } from '@/repository';

const api = useApi<IProfileFeaturesClient>(ENDPOINT_PROFILE_FEATURES);

export default {
  async updateState(model: UpdateFeatureModel) {
    return api.post<'updateState'>(ENDPOINT_PROFILE_FEATURES, model);
  },
};
