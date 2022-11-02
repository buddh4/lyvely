import { ProfileContext } from '../models';
import { ProfileRelationInfo, ProfileRelationInfos, ProfileWithRelationsDto, registerMapping } from '@lyvely/common';

export function useProfileMappings() {
  registerMapping(ProfileContext, ProfileRelationInfo, (relations) => {
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

  registerMapping([ProfileContext], ProfileRelationInfos, (relations) => {
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

  registerMapping(ProfileContext, ProfileWithRelationsDto, (relations) => {
    return new ProfileWithRelationsDto({
      ...relations.profile,
      relations: relations.relations,
    });
  });
}
