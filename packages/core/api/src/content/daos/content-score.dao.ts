import { ProfileScoreTypeDao } from '@/profiles';
import { ContentScore } from '../schemas';
import { Dao } from '@/core';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(ContentScore, { isolation: TenancyIsolation.Profile })
export class ContentScoreDao extends ProfileScoreTypeDao<ContentScore> {}
