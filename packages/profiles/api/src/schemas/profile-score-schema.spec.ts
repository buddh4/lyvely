import { TestingModule } from '@nestjs/testing';
import { ProfileScore, ProfileScoreSchema } from './index';
import { createBasicTestingModule, getObjectId, TestDataUtils } from '@lyvely/testing';
import { Model } from 'mongoose';
import {
  TestProfileScore,
  TestProfileScoreDocument,
  TestProfileScoreSchema,
} from '../test/test-profile-score.schema';
import { addDays, toTimingId, UserAssignmentStrategy } from '@lyvely/common';

describe('ProfileScore', () => {
  let testingModule: TestingModule;
  let testDataUtils: TestDataUtils;
  let TestProfileScoreModel: Model<TestProfileScoreDocument>;

  const TEST_KEY = 'ProfileScore';

  const Models = [
    {
      name: ProfileScore.name,
      schema: ProfileScoreSchema,
      discriminators: [{ name: TestProfileScore.name, schema: TestProfileScoreSchema }],
    },
  ];

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY, [], Models).compile();
    TestProfileScoreModel =
      testingModule.get<Model<TestProfileScoreDocument>>('TestProfileScoreModel');
    testDataUtils = testingModule.get<TestDataUtils>(TestDataUtils);
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
      expect(model.uid).toBeNull();
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
