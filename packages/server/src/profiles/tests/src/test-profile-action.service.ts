import { Inject, Injectable } from '@nestjs/common';
import { TestProfileAction } from './test-score.schema';
import { ProfileScoreActionService } from '../../services';
import { TestProfileActionDao } from './test-profile-action.dao';

@Injectable()
export class TestProfileActionService extends ProfileScoreActionService<TestProfileAction> {

  @Inject()
  profileScoreActionDao: TestProfileActionDao;
}
