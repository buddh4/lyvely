import {
  ENDPOINT_PROFILE_RELATION_INFOS,
  IProfileRelationInfosClient,
  ProfileRelationInfosEndpointPaths,
} from './profile-relation-infos.endpoint';
import { useApi } from '@/repository';

const api = useApi<IProfileRelationInfosClient>(ENDPOINT_PROFILE_RELATION_INFOS);

export default {
  async getRelations() {
    return api.get<'getAllProfileRelationInfos'>();
  },

  async getProfileRelationUserInfo(pid: string, uid: string) {
    return api.get<'getProfileRelationUserInfo'>(
      ProfileRelationInfosEndpointPaths.PROFILE_RELATION_INFO(pid, uid),
    );
  },
};
