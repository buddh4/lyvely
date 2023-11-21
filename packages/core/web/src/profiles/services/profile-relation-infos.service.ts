import {
  IProfileRelationInfosService,
  ProfileRelationInfos,
  ProfileRelationUserInfoModel,
} from '@lyvely/core-interface';
import { EntityNotFoundException, IntegrityException, useSingleton } from '@lyvely/common';
import profileRelationsRepository from '@/profiles/repositories/profile-relations.repository';
import { unwrapAndTransformResponse } from '@/core';

const userInfoCache = new Map<string, ProfileRelationUserInfoModel>();
const pendingCache = new Map<string, Promise<ProfileRelationUserInfoModel>>();

class ProfileRelationInfosService implements IProfileRelationInfosService {
  async getAllProfileRelationInfos(): Promise<ProfileRelationInfos> {
    return unwrapAndTransformResponse(
      profileRelationsRepository.getRelations(),
      ProfileRelationInfos,
    );
  }

  async getProfileRelationUserInfo(
    pid: string,
    uid: string,
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
      profileRelationsRepository.getProfileRelationUserInfo(pid, uid),
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

export const useProfileRelationInfosService = useSingleton<ProfileRelationInfosService>(
  () => new ProfileRelationInfosService(),
);
