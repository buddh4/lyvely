import { Inject, Injectable } from '@nestjs/common';
import { TestProfileScore } from './test-profile-score.schema';
import { ProfileScoreService } from '../services';
import { TestProfileScoreTypeDao } from './test-profile-score.dao';

@Injectable()
export class TestProfileScoreService extends ProfileScoreService<TestProfileScore> {
  @Inject()
  override profileScoreDao: TestProfileScoreTypeDao;
}
