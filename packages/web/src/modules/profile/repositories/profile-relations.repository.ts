import repository from "@server/repository";
import { ProfileRelationInfos, ENDPOINT_PROFILE_RELATION_INFOS } from "@lyvely/common";

export default {
  async getRelations() {
    return repository.get<ProfileRelationInfos>(`${ENDPOINT_PROFILE_RELATION_INFOS}`);
  },
};
