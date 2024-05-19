import {
  API_PROFILE_RELATION_INFOS,
  IProfileRelationInfosClient,
  ProfileRelationInfosEndpoints,
} from './profile-relation-infos.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IProfileRelationInfosClient>(API_PROFILE_RELATION_INFOS);

export default {
  async getRelations(options?: IProfileApiRequestOptions) {
    return api.get<'getAllProfileRelationInfos'>(options);
  },

  async getProfileRelationUserInfo(pid: string, uid: string, options?: IProfileApiRequestOptions) {
    return api.get<'getProfileRelationUserInfo'>(
      ProfileRelationInfosEndpoints.PROFILE_RELATION_INFO(pid, uid),
      options,
    );
  },
};
