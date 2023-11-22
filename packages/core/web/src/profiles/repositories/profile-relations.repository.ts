import {
  ENDPOINT_PROFILE_RELATION_INFOS,
  IProfileRelationInfosService,
  useApiRepository,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async getRelations() {
    return useApiRepository().get<
      EndpointResult<IProfileRelationInfosService['getAllProfileRelationInfos']>
    >(`${ENDPOINT_PROFILE_RELATION_INFOS}`);
  },

  async getProfileRelationUserInfo(pid: string, uid: string) {
    return useApiRepository().get<
      EndpointResult<IProfileRelationInfosService['getProfileRelationUserInfo']>
    >(`${ENDPOINT_PROFILE_RELATION_INFOS}/${pid}/${uid}`);
  },
};
