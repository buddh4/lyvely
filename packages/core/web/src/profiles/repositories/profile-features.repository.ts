import { repository } from '@/core';
import {
  UpdateFeatureModel,
  IProfileFeaturesService,
  ENDPOINT_PROFILE_FEATURES,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async updateState(model: UpdateFeatureModel) {
    return repository.post<EndpointResult<IProfileFeaturesService['updateState']>>(
      ENDPOINT_PROFILE_FEATURES,
      model,
    );
  },
};