import { ProfileUserContext, ProfileRelations } from '../models';
import {
  ProfileRelationInfo,
  ProfileRelationInfos,
  ProfileWithRelationsModel,
} from '@lyvely/core-interface';
import { registerMapping } from '@lyvely/common';

export function useProfileMappings() {
  registerMapping(ProfileUserContext, ProfileRelationInfo, (relations) => {
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

  registerMapping([ProfileUserContext], ProfileRelationInfos, (relations) => {
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

  registerMapping(ProfileRelations, ProfileWithRelationsModel<any>, (relations) => {
    return new ProfileWithRelationsModel<any>({
      ...relations.profile,
      userRelations: relations.userRelations,
      profileRelations: relations.profileRelations,
    });
  });

  registerMapping(ProfileUserContext, ProfileWithRelationsModel<any>, (relations) => {
    return new ProfileWithRelationsModel<any>({
      ...relations.profile,
      userRelations: relations.relations,
      profileRelations: relations.relations,
    });
  });
}
