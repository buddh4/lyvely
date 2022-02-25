import { Inject, Injectable } from '@nestjs/common';
import { TestProfileAction } from './test-score.schema';
import { AbstractUserProfileActionService } from '../../services';
import { TestProfileActionDao } from './test-profile-action.dao';

@Injectable()
export class TestProfileActionService extends AbstractUserProfileActionService<TestProfileAction> {

  @Inject()
  userProfileActionDao: TestProfileActionDao;
}