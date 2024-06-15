import { ProfileScoreTypeDao } from '@/profiles';
import { ContentScore } from '../schemas';
import { Dao } from '@/core';

@Dao(ContentScore)
export class ContentScoreDao extends ProfileScoreTypeDao<ContentScore> {}
