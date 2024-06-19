import { ILyvelyTestingModule } from '@/testing';
import { ProfileScore, ProfileScoreSchema } from '../schemas';
import {
  TestProfileScore,
  TestProfileScoreSchema,
  ProfileTestDataUtils,
  TestProfileScoreTypeDao,
  TestProfileScoreService,
  buildProfileTest,
} from '../testing';
import { INestApplication } from '@nestjs/common';
import { ProfilesDao } from '../daos';
import { toTimingId } from '@lyvely/dates';

const testScoreModelDef = {
  name: ProfileScore.name,
  schema: ProfileScoreSchema,
  discriminators: [{ name: TestProfileScore.name, schema: TestProfileScoreSchema }],
};

describe('AbstractUserProfileActionService', () => {
  let testingModule: ILyvelyTestingModule;
  let testProfileActionService: TestProfileScoreService;
  let testData: ProfileTestDataUtils;
  let profileDao: ProfilesDao;

  const TEST_KEY = 'abstract_user_profile_action_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY)
      .providers([TestProfileScoreTypeDao, TestProfileScoreService])
      .models([testScoreModelDef])
      .withApp()
      .compile();
    testProfileActionService = testingModule.get<TestProfileScoreService>(TestProfileScoreService);
    testData = testingModule.get(ProfileTestDataUtils);
    profileDao = testingModule.get(ProfilesDao);
  });

  afterEach(async () => {
    await testingModule.afterEach();
  });

  describe('createUserProfileAction()', () => {
    it('model creation', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const model = await testProfileActionService.saveScore(
        context,
        new TestProfileScore({ context, score: 5 }, { text: 'test' })
      );

      expect(model).toBeDefined();
      expect(model.id).toBeDefined();
      expect(model.pid).toEqual(profile._id);
      expect(model.uid).toEqual(user._id);
      expect(model.score).toEqual(5);
      expect(model.text).toEqual('test');
      expect(model.tid).toEqual(toTimingId(new Date()));
      expect(profile.score).toEqual(5);
    });

    it('profile score is updated', async () => {
      const { profile, context } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.saveScore(
        context,
        new TestProfileScore({ context, score: 5 }, { text: 'test' })
      );

      expect(profile.score).toEqual(5);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB?.score).toEqual(5);
    });

    it('create multiple actions', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.saveScore(
        context,
        new TestProfileScore({ context, score: 5 }, { text: 'test' })
      );

      await testProfileActionService.saveScore(
        context,
        new TestProfileScore({ context, score: -2 }, { text: 'test2' })
      );

      expect(profile.score).toEqual(3);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB?.score).toEqual(3);
    });

    it('min 0 profile score', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.saveScore(
        context,
        new TestProfileScore({ context, score: -10 }, { text: 'test' })
      );

      expect(profile.score).toEqual(0);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB?.score).toEqual(0);
    });
  });
});
