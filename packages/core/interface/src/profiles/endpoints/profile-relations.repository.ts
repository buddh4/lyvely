import {
  ENDPOINT_PROFILE_RELATION_INFOS,
  IProfileRelationInfosClient,
  ProfileRelationInfosEndpointPaths,
} from './profile-relation-infos.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IProfileRelationInfosClient>(ENDPOINT_PROFILE_RELATION_INFOS);

export default {
  async getRelations(options?: IProfileApiRequestOptions) {
    return api.get<'getAllProfileRelationInfos'>(options);
  },

  async getProfileRelationUserInfo(pid: string, uid: string, options?: IProfileApiRequestOptions) {
    return api.get<'getProfileRelationUserInfo'>(
      ProfileRelationInfosEndpointPaths.PROFILE_RELATION_INFO(pid, uid),
      options,
    );
  },
};
