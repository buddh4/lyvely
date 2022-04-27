import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createTestingModule } from '../../test/utils/test.utils';
import { Calendar, CalendarIntervalEnum } from 'lyvely-common';
import { ProfileScoreAction, ProfileScoreActionSchema } from '../schemas';
import { TestProfileAction, TestScoreSchema } from './src/test-score.schema';
import { TestProfileActionDao } from './src/test-profile-action.dao';
import { INestApplication } from '@nestjs/common';

const testScoreModelDef = {
  name: ProfileScoreAction.name,
  schema: ProfileScoreActionSchema,
  discriminators: [
    { name: TestProfileAction.name, schema: TestScoreSchema }
  ],
};

describe('AbstractUserProfileActionDao', () => {
  let testingModule: TestingModule;
  let testScoreDao: TestProfileActionDao;
  let testData: TestDataUtils;
  let app: INestApplication;

  const TEST_KEY = 'abstract_user_profile_action_dao';

  beforeEach(async () => {
    testingModule = await createTestingModule(TEST_KEY, [TestProfileActionDao], [testScoreModelDef]).compile();
    testScoreDao = testingModule.get<TestProfileActionDao>(TestProfileActionDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
    await app.close();
  });

  it('should be defined', () => {
    expect(testScoreDao).toBeDefined();
  });

  describe('create()', () => {
    it('create test score instance', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const scoreLog = await testScoreDao.save(new TestProfileAction({ user: user, profile: profile, score: 5, text: 'test' }));
      const timing = Calendar.createTiming(CalendarIntervalEnum.Daily, new Date(), profile.getLocale());

      expect(scoreLog).toBeDefined();
      expect(scoreLog.id).toBeDefined();
      expect(scoreLog.pid).toEqual(profile._id);
      expect(scoreLog.uid).toEqual(user._id);
      expect(scoreLog.score).toEqual(5);
      expect(scoreLog.text).toEqual('test');
      expect(scoreLog.timing).toBeDefined();
      expect(scoreLog.timing.timingId).toEqual(timing.timingId);
    });
  });
});
