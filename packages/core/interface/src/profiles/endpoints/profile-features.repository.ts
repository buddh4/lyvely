import { UpdateFeatureModel } from '../models';
import { IProfileFeaturesClient, API_PROFILE_FEATURES } from './profile-features.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IProfileFeaturesClient>(API_PROFILE_FEATURES);

export default {
  async updateState(model: UpdateFeatureModel, options?: IProfileApiRequestOptions) {
    return api.post<'updateState'>(model, options);
  },
};
