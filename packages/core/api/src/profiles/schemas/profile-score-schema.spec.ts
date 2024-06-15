import { ProfileScore, ProfileScoreSchema } from './index';
import { getObjectId, ILyvelyTestingModule } from '@/testing';
import { Model } from '@/core';
import {
  TestProfileScore,
  TestProfileScoreSchema,
  ProfileTestDataUtils,
  buildProfileTest,
} from '../testing';
import { addDays, toTimingId } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/interface';

describe('ProfileScore', () => {
  let testingModule: ILyvelyTestingModule;
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
    testingModule = await buildProfileTest(TEST_KEY).models(Models).compile();
    TestProfileScoreModel = testingModule.get('TestProfileScoreModel');
    testDataUtils = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  describe('constructor', () => {
    it('Construct with per user strategy', async () => {
      const { user, profile, context } = await testDataUtils.createUserAndProfile();
      profile.oid = getObjectId('MyOrg');
      const model = new TestProfileScore({ context, score: 5 }, { text: 'Test!' });
      expect(model.score).toEqual(5);
      expect(model.pid).toEqual(profile._id);
      expect(model.uid).toEqual(user._id);
      expect(model.oid).toEqual(profile.oid);
      expect(model.tid).toEqual(toTimingId(new Date()));
      expect(model.createdBy).toEqual(user._id);
      expect(model.text).toEqual('Test!');
    });

    it('Construct with given date', async () => {
      const { context } = await testDataUtils.createUserAndProfile();
      const tomorrow = addDays(new Date(), 1);
      const model = new TestProfileScore({ context, score: 5, date: tomorrow });
      expect(model.tid).toEqual(toTimingId(tomorrow));
    });

    it('Construct with per shared user strategy', async () => {
      const { user, context } = await testDataUtils.createUserAndProfile();
      const model = new TestProfileScore({
        context,
        score: 5,
        userStrategy: UserAssignmentStrategy.Shared,
      });
      expect(model.uid).toEqual(user._id);
      expect(model.createdBy).toEqual(user._id);
    });

    it('Overwrite createdBy', async () => {
      const { context } = await testDataUtils.createUserAndProfile();
      const createdBy = getObjectId('OtherUser');
      const model = new TestProfileScore(
        { context, score: 5, userStrategy: UserAssignmentStrategy.Shared },
        { createdBy }
      );
      expect(model.createdBy).toEqual(createdBy);
    });
  });
});
