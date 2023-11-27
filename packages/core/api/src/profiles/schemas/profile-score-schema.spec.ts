import { ProfileScore, ProfileScoreSchema } from './index';
import { buildTest, getObjectId, LyvelyTestingModule } from '@/testing';
import { Model } from '@/core';
import {
  TestProfileScore,
  TestProfileScoreSchema,
  profilesTestPlugin,
  ProfileTestDataUtils,
} from '../testing';
import { addDays, toTimingId } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/interface';

describe('ProfileScore', () => {
  let testingModule: LyvelyTestingModule;
  let testDataUtils: ProfileTestDataUtils;
  let TestProfileScoreModel: Model<TestProfileScore>;

  const TEST_KEY = 'ProfileScore';

  const Models = [
    {
      name: ProfileScore.name,
      schema: ProfileScoreSchema,
      discriminators: [{ name: TestProfileScore.name, schema: TestProfileScoreSchema }],
    },
  ];

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin])
      .models(Models)
      .compile();
    TestProfileScoreModel = testingModule.get('TestProfileScoreModel');
    testDataUtils = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(TestProfileScoreModel).toBeDefined();
  });

  describe('constructor', () => {
    it('Construct with per user strategy', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      profile.oid = getObjectId('MyOrg');
      const model = new TestProfileScore({ user, profile, score: 5 }, { text: 'Test!' });
      expect(model.score).toEqual(5);
      expect(model.pid).toEqual(profile._id);
      expect(model.uid).toEqual(user._id);
      expect(model.oid).toEqual(profile.oid);
      expect(model.tid).toEqual(toTimingId(new Date()));
      expect(model.createdBy).toEqual(user._id);
      expect(model.text).toEqual('Test!');
    });

    it('Construct with given date', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const tomorrow = addDays(new Date(), 1);
      const model = new TestProfileScore({ user, profile, score: 5, date: tomorrow });
      expect(model.tid).toEqual(toTimingId(tomorrow));
    });

    it('Construct with per shared user strategy', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const model = new TestProfileScore({
        user,
        profile,
        score: 5,
        userStrategy: UserAssignmentStrategy.Shared,
      });
      expect(model.uid).toBeUndefined();
      expect(model.createdBy).toEqual(user._id);
    });

    it('Overwrite createdBy', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const createdBy = getObjectId('OtherUser');
      const model = new TestProfileScore(
        { user, profile, score: 5, userStrategy: UserAssignmentStrategy.Shared },
        { createdBy },
      );
      expect(model.createdBy).toEqual(createdBy);
    });
  });
});
