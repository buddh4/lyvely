import { repository } from '@/core';
import {
  ProfileRelationInfos,
  ENDPOINT_PROFILE_RELATION_INFOS,
  IProfileRelationInfosService,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async getRelations() {
    return repository.get<
      EndpointResult<IProfileRelationInfosService['getAllProfileRelationInfos']>
    >(`${ENDPOINT_PROFILE_RELATION_INFOS}`);
  },

  async getProfileRelationUserInfo(pid: string, uid: string) {
    return repository.get<
      EndpointResult<IProfileRelationInfosService['getProfileRelationUserInfo']>
    >(`${ENDPOINT_PROFILE_RELATION_INFOS}/${pid}/${uid}`);
  },
};
