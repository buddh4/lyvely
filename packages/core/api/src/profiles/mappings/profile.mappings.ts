import { ProfileContext, ProtectedProfileContext, UserAndProfileRelations } from '../models';
import {
  ProfileRelationInfo,
  ProfileRelationInfos,
  ProfileWithRelationsModel,
} from '@lyvely/interface';
import { registerMapping } from '@lyvely/common';

export function useProfileMappings() {
  registerMapping(ProtectedProfileContext, ProfileRelationInfo, (relations) => {
    const { id, name, description, score, type } = relations.profile;
    return new ProfileRelationInfo({
      id,
      name,
      description,
      score,
      type,
      relations: relations.relations.map(({ type, role }) => ({ type, role })),
    });
  });

  registerMapping([ProtectedProfileContext], ProfileRelationInfos, (relations) => {
    return new ProfileRelationInfos({
      profiles: relations.map((relation) => {
        const { name, description, score, type, guid, id } = relation.profile;
        return new ProfileRelationInfo({
          ...{ name, description, score, type, guid, id },
          relations: relation.relations.map(({ type, role }) => ({ type, role })),
        });
      }),
    });
  });

  registerMapping(UserAndProfileRelations, ProfileWithRelationsModel<any>, (relations) => {
    return new ProfileWithRelationsModel<any>({
      ...relations.profile,
      userRelations: relations.userRelations,
      profileRelations: relations.profileRelations,
    });
  });

  registerMapping(ProfileContext, ProfileWithRelationsModel<any>, (relations) => {
    return new ProfileWithRelationsModel<any>({
      ...relations.profile,
      userRelations: relations.relations,
      profileRelations: relations.relations,
    });
  });

  registerMapping(ProtectedProfileContext, ProfileWithRelationsModel<any>, (relations) => {
    return new ProfileWithRelationsModel<any>({
      ...relations.profile,
      userRelations: relations.relations,
      profileRelations: relations.relations,
    });
  });
}
