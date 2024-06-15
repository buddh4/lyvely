import { Inject } from '@nestjs/common';
import { ProfileScore } from '../schemas';
import { AbstractDao, Dao } from '@/core';
import { ProfileScoreTypeRegistry } from '@/profiles/registires';

/**
 * Generic profile score dao.
 */
@Dao(ProfileScore)
export class ProfileScoreDao extends AbstractDao<ProfileScore> {
  @Inject()
  protected override typeRegistry: ProfileScoreTypeRegistry;
}
