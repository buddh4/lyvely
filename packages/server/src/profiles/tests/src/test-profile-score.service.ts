import { Inject, Injectable } from '@nestjs/common';
import { TestProfileScore } from './test-profile-score.schema';
import { ProfileScoreService } from '@/profiles';
import { TestProfileScoreDao } from './test-profile-score.dao';

@Injectable()
export class TestProfileScoreService extends ProfileScoreService<TestProfileScore> {
  @Inject()
  profileScoreDao: TestProfileScoreDao;
}
