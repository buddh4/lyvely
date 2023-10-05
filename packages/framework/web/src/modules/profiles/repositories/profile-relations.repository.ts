import repository from '@/repository';
import { ProfileRelationInfos, ENDPOINT_PROFILE_RELATION_INFOS } from '@lyvely/profiles-interface';

export default {
  async getRelations() {
    return repository.get<ProfileRelationInfos>(`${ENDPOINT_PROFILE_RELATION_INFOS}`);
  },
};
