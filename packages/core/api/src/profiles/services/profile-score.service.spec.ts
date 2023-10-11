import { buildTest, LyvelyTestingModule } from '@/testing';
import { ProfileScore, ProfileScoreSchema } from '../schemas';
import {
  TestProfileScore,
  TestProfileScoreSchema,
  profilesTestPlugin,
  ProfileTestDataUtils,
  TestProfileScoreDao,
  TestProfileScoreService,
} from '../testing';
import { INestApplication } from '@nestjs/common';
import { ProfileDao } from '../daos';
import { toTimingId } from '@lyvely/dates';

const testScoreModelDef = {
  name: ProfileScore.name,
  schema: ProfileScoreSchema,
  discriminators: [{ name: TestProfileScore.name, schema: TestProfileScoreSchema }],
};

describe('AbstractUserProfileActionService', () => {
  let testingModule: LyvelyTestingModule;
  let testProfileActionService: TestProfileScoreService;
  let testData: ProfileTestDataUtils;
  let profileDao: ProfileDao;
  let app: INestApplication;

  const TEST_KEY = 'abstract_user_profile_action_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin])
      .providers([TestProfileScoreDao, TestProfileScoreService])
      .models([testScoreModelDef])
      .compile();
    testProfileActionService = testingModule.get<TestProfileScoreService>(TestProfileScoreService);
    testData = testingModule.get(ProfileTestDataUtils);
    profileDao = testingModule.get(ProfileDao);
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(testProfileActionService).toBeDefined();
  });

  describe('createUserProfileAction()', () => {
    it('model creation', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const model = await testProfileActionService.saveScore(
        profile,
        new TestProfileScore({ user: user, profile: profile, score: 5 }, { text: 'test' }),
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
      const { user, profile } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.saveScore(
        profile,
        new TestProfileScore({ user: user, profile: profile, score: 5 }, { text: 'test' }),
      );

      expect(profile.score).toEqual(5);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB?.score).toEqual(5);
    });

    it('create multiple actions', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.saveScore(
        profile,
        new TestProfileScore({ user: user, profile: profile, score: 5 }, { text: 'test' }),
      );

      await testProfileActionService.saveScore(
        profile,
        new TestProfileScore({ user: user, profile: profile, score: -2 }, { text: 'test2' }),
      );

      expect(profile.score).toEqual(3);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB?.score).toEqual(3);
    });

    it('min 0 profile score', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      expect(profile.score).toEqual(0);

      await testProfileActionService.saveScore(
        profile,
        new TestProfileScore({ user: user, profile: profile, score: -10 }, { text: 'test' }),
      );

      expect(profile.score).toEqual(0);
      const profileInDB = await profileDao.reload(profile);
      expect(profileInDB?.score).toEqual(0);
    });
  });
});