import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils, createContentTestingModule } from '@lyvely/testing';
import { ProfileScore, ProfileScoreSchema } from '../schemas';
import { TestProfileScore, TestProfileScoreSchema } from '../test/test-profile-score.schema';
import { TestProfileScoreDao } from '../test/test-profile-score.dao';
import { toTimingId } from '@lyvely/dates';

const testScoreModelDef = {
  name: ProfileScore.name,
  schema: ProfileScoreSchema,
  discriminators: [{ name: TestProfileScore.name, schema: TestProfileScoreSchema }],
};

describe('AbstractUserProfileActionDao', () => {
  let testingModule: TestingModule;
  let testScoreDao: TestProfileScoreDao;
  let testData: TestDataUtils;

  const TEST_KEY = 'abstract_user_profile_action_dao';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(
      TEST_KEY,
      [TestProfileScoreDao],
      [testScoreModelDef],
    ).compile();
    testScoreDao = testingModule.get<TestProfileScoreDao>(TestProfileScoreDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  it('should be defined', () => {
    expect(testScoreDao).toBeDefined();
  });

  describe('create()', () => {
    it('create test score instance', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const scoreLog = await testScoreDao.save(
        new TestProfileScore({ user: user, profile: profile, score: 5 }, { text: 'test' }),
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
