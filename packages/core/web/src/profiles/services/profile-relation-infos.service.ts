import { IProfileRelationInfosService, ProfileRelationInfos } from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import profileRelationsRepository from '@/profiles/repositories/profile-relations.repository';

class ProfileRelationInfosService implements IProfileRelationInfosService {
  async getUserProfileInfos(): Promise<ProfileRelationInfos> {
    const { data } = await profileRelationsRepository.getRelations();
    return new ProfileRelationInfos(data);
  }
}

export const useProfileRelationInfosService = useSingleton<ProfileRelationInfosService>(
  () => new ProfileRelationInfosService(),
);
