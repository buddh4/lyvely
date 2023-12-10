import { ProfileRelationInfos, ProfileRelationUserInfoModel } from '../models';
import { IProfileRelationInfosClient } from './profile-relation-infos.endpoint';
import { IntegrityException } from '@/exceptions';
import { useSingleton } from '@lyvely/common';
import profileRelationsRepository from './profile-relation-infos.repository';
import { IProfileApiRequestOptions, unwrapAndTransformResponse } from '@/endpoints';

const userInfoCache = new Map<string, ProfileRelationUserInfoModel>();
const pendingCache = new Map<string, Promise<ProfileRelationUserInfoModel>>();

class ProfileRelationInfosClient implements IProfileRelationInfosClient {
  async getAllProfileRelationInfos(
    options?: IProfileApiRequestOptions,
  ): Promise<ProfileRelationInfos> {
    return unwrapAndTransformResponse(
      profileRelationsRepository.getRelations(options),
      ProfileRelationInfos,
    );
  }

  async getProfileRelationUserInfo(
    pid: string,
    uid: string,
    options?: IProfileApiRequestOptions,
  ): Promise<ProfileRelationUserInfoModel> {
    const cacheKey = pid + '_' + uid;
    const cached = userInfoCache.get(cacheKey);
    if (cached) return cached;

    if (!uid) throw new IntegrityException();

    const pending = pendingCache.get(cacheKey);
    if (pending) {
      return new Promise((resolve, reject) => {
        pending.then(resolve).catch(reject);
      });
    }

    const promise = unwrapAndTransformResponse(
      profileRelationsRepository.getProfileRelationUserInfo(pid, uid, options),
      ProfileRelationUserInfoModel,
    );

    pendingCache.set(cacheKey, promise);

    try {
      const result = await promise;
      userInfoCache.set(cacheKey, result);
      return result;
    } finally {
      pendingCache.delete(cacheKey);
    }
  }
}

export const useProfileRelationInfosClient = useSingleton(() => new ProfileRelationInfosClient());
