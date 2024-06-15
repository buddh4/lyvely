import { TestProfileScore } from './test-profile-score.schema';
import { ProfileScoreTypeDao } from '../daos';
import { Dao } from '@/core';

@Dao(TestProfileScore)
export class TestProfileScoreTypeDao extends ProfileScoreTypeDao<TestProfileScore> {}
