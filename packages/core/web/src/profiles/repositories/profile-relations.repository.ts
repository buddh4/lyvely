import { repository } from '@/core';
import { ProfileRelationInfos, ENDPOINT_PROFILE_RELATION_INFOS } from '@lyvely/core-interface';

export default {
  async getRelations() {
    return repository.get<ProfileRelationInfos>(`${ENDPOINT_PROFILE_RELATION_INFOS}`);
  },
};
