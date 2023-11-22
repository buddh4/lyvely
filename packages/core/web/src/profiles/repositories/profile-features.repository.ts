import {
  UpdateFeatureModel,
  IProfileFeaturesService,
  ENDPOINT_PROFILE_FEATURES,
  useApiRepository,
} from '@lyvely/interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async updateState(model: UpdateFeatureModel) {
    return useApiRepository().post<EndpointResult<IProfileFeaturesService['updateState']>>(
      ENDPOINT_PROFILE_FEATURES,
      model,
    );
  },
};
