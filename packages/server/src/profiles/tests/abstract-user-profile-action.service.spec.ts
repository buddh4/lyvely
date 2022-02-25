import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createTestingModule } from '../../test/utils/test.utils';
import { Calendar, CalendarIntervalEnum } from 'lyvely-common';
import { ProfileAction, UserProfileLogSchema } from '../schemas';
import { TestProfileAction, TestScoreSchema } from './src/test-score.schema';
import { TestProfileActionDao } from './src/test-profile-action.dao';
import { INestApplication } from '@nestjs/common';
import { TestProfileActionService } from './src/test-profile-action.service';
import { ProfileDao } from '../daos';

const testScoreModelDef = {
  name: ProfileAction.name,
  schema: UserProfileLogSchema,
  discriminators: [
    { name: TestProfileAction.name, schema: TestScoreSchema }
  ],
};

describe('AbstractUserProfileActionService', () => {
  let testingModule: TestingModule;
  let testProfileActionService: TestProfileActionService;
  let testData: TestDataUtils;
  let profileDao: ProfileDao;
  let app: INestApplication;

  const TEST_KEY = 'abstract_user_profile_action_service';

  beforeEach(async () => {
    testingModule = await createTestingModule(TEST_KEY, [TestProfileActionDao, TestProfileActionService], [testScoreModelDef]).compile();
    testProfileActionService = testingModule.get<TestProfileActionService>(TestProfileActionService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    profileDao = testingModule.get<ProfileDao>(ProfileDao);
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
    await app.close();
  });

  it('should be defined', () => {
    expect(testProfileActionService).toBeDefined();
  });

  describe('createUserProfileAction()', () => {
    it('model creation', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const model = await testProfileActionService.createUserProfileAction(profile,
        new TestProfileAction({ user: user, profile: profile, score: 5, text: 'test' }));
      const timing = Calendar.createTiming(CalendarIntervalEnum.Daily, new Date(), profile.getLocale());

      expect(model).toBeDefined();
      expect(model.id).toBeDefined();
      expect(model.pid).toEqual(profile._id);
      expect(model.uid).toEqual(user._id);
      expect(model.score).toEqual(5);
      expect(model.text).toEqual('test');
      expect(model.timing).toBeDefined();
      expect(model.timing.timingId).toEqual(timing.timingId);
      expect(profile.score).toEqual(5);
    });

    it('profile score is updated', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.createUserProfileAction(profile,
        new TestProfileAction({ user: user, profile: profile, score: 5, text: 'test' }));

      expect(profile.score).toEqual(5);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB.score).toEqual(5);
    });

    it('create multiple actions', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.createUserProfileAction(profile,
        new TestProfileAction({ user: user, profile: profile, score: 5, text: 'test' }));

      await testProfileActionService.createUserProfileAction(profile,
        new TestProfileAction({ user: user, profile: profile, score: -2, text: 'test2' }));

      expect(profile.score).toEqual(3);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB.score).toEqual(3);
    });

    it('min 0 profile score', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.createUserProfileAction(profile,
        new TestProfileAction({ user: user, profile: profile, score: -10, text: 'test' }));

      expect(profile.score).toEqual(0);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB.score).toEqual(0);
    });

    it('undefined score value', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      const model = await testProfileActionService.createUserProfileAction(profile,
        new TestProfileAction({ user: user, profile: profile, text: 'test' }));

      expect(model.score).toEqual(0);
    });
  });
});
