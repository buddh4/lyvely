import { ILyvelyTestingModule } from '@/testing';
import { ProfileScore, ProfileScoreSchema } from '../schemas';
import {
  TestProfileScore,
  TestProfileScoreSchema,
  ProfileTestDataUtils,
  TestProfileScoreTypeDao,
  buildProfileTest,
} from '../testing';
import { toTimingId } from '@lyvely/dates';

const testScoreModelDef = {
  name: ProfileScore.name,
  schema: ProfileScoreSchema,
  discriminators: [{ name: TestProfileScore.name, schema: TestProfileScoreSchema }],
};

describe('AbstractUserProfileActionDao', () => {
  let testingModule: ILyvelyTestingModule;
  let testScoreDao: TestProfileScoreTypeDao;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'abstract_user_profile_action_dao';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY)
      .providers([TestProfileScoreTypeDao])
      .models([testScoreModelDef])
      .compile();
    testScoreDao = testingModule.get<TestProfileScoreTypeDao>(TestProfileScoreTypeDao);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(testScoreDao).toBeDefined();
  });

  describe('create()', () => {
    it('create test score instance', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const scoreLog = await testScoreDao.save(
        new TestProfileScore({ context, score: 5 }, { text: 'test' }),
      );

      expect(scoreLog).toBeDefined();
      expect(scoreLog.id).toBeDefined();
      expect(scoreLog.pid).toEqual(profile._id);
      expect(scoreLog.uid).toEqual(user._id);
      expect(scoreLog.score).toEqual(5);
      expect(scoreLog.text).toEqual('test');
      expect(scoreLog.tid).toEqual(toTimingId(new Date()));
    });
  });
});
