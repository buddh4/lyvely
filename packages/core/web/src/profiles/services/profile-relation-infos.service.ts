import {
  IProfileRelationInfosService,
  ProfileRelationInfos,
  ProfileRelationUserInfoModel,
} from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import profileRelationsRepository from '@/profiles/repositories/profile-relations.repository';
import { unwrapAndTransformResponse } from '@/core';

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
    return unwrapAndTransformResponse(
      profileRelationsRepository.getProfileRelationUserInfo(pid, uid),
      ProfileRelationUserInfoModel,
    );
  }
}

export const useProfileRelationInfosService = useSingleton<ProfileRelationInfosService>(
  () => new ProfileRelationInfosService(),
);
