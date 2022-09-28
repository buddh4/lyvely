import {
  IProfileRelationInfosEndpoint,
  ProfileRelationInfos,
  useSingleton,
} from "@lyvely/common";
import profileRelationsRepository from "@/modules/profiles/repositories/profile-relations.repository";

class ProfileRelationInfosService implements IProfileRelationInfosEndpoint {
  async getUserProfileInfos(): Promise<ProfileRelationInfos> {
    const { data } = await profileRelationsRepository.getRelations();
    return new ProfileRelationInfos(data);
  }
}

export const useProfileRelationInfosService =
  useSingleton<ProfileRelationInfosService>(
    () => new ProfileRelationInfosService()
  );