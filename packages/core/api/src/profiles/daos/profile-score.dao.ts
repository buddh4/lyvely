import { Inject } from '@nestjs/common';
import { ProfileScore } from '../schemas';
import { AbstractDao, Dao } from '@/core';
import { ProfileScoreTypeRegistry } from '@/profiles/registires';
import { TenancyIsolation } from '@/core/tenancy';

/**
 * Generic profile score dao.
 */
@Dao(ProfileScore, { isolation: TenancyIsolation.Profile })
export class ProfileScoreDao extends AbstractDao<ProfileScore> {
  @Inject()
  protected override typeRegistry: ProfileScoreTypeRegistry;
}
