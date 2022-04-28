import { Inject, Injectable } from '@nestjs/common';
import { TestProfileScore } from './test-profile-score.schema';
import { ProfileScoreService } from '../../services';
import { TestProfileActionDao } from './test-profile-action.dao';

@Injectable()
export class TestProfileActionService extends ProfileScoreService<TestProfileScore> {

  @Inject()
  profileScoreDao: TestProfileActionDao;
}
