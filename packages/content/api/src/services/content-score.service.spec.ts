import { TestingModule } from '@nestjs/testing';
import { ProfileScore } from '@lyvely/profiles';
import { createBasicTestingModule, getObjectId, TestDataUtils } from '@lyvely/test';
import { ContentScore, ContentScoreSchema } from '../schemas';
import {
  ExtendedTestContentScore,
  ExtendedTestContentScoreDocument,
  ExtendedTestContentScoreSchema,
  TestContentScore,
  TestContentScoreDocument,
  TestContentScoreSchema,
} from '../test/test-content-score.schema';
import { Model } from 'mongoose';
import { expect } from '@jest/globals';
import { ContentScoreService } from './index';
import { ContentScoreDao } from '../daos';
import { toTimingId, UserAssignmentStrategy } from '@lyvely/common';
import { TestContent } from '../test/test-content.schema';

describe('ContentScoreService', () => {
  let testingApp: TestingModule;
  let testDataUtils: TestDataUtils;
  let TestContentScoreModel: Model<TestContentScoreDocument>;
  let ExtendedTestContentScoreModel: Model<ExtendedTestContentScoreDocument>;
  let contentScoreService: ContentScoreService;

  const TEST_KEY = 'ContentScoreService';

  const Models = [
    {
      name: ContentScore.name,
      collection: ProfileScore.collectionName(),
      schema: ContentScoreSchema,
      discriminators: [
        { name: TestContentScore.name, schema: TestContentScoreSchema },
        { name: ExtendedTestContentScore.name, schema: ExtendedTestContentScoreSchema },
      ],
    },
  ];

  beforeEach(async () => {
    testingApp = await createBasicTestingModule(
      TEST_KEY,
      [ContentScoreService, ContentScoreDao],
      Models,
    ).compile();
    contentScoreService = testingApp.get<ContentScoreService>(ContentScoreService);
    testDataUtils = testingApp.get<TestDataUtils>(TestDataUtils);
    TestContentScoreModel =
      testingApp.get<Model<TestContentScoreDocument>>('TestContentScoreModel');
    ExtendedTestContentScoreModel = testingApp.get<Model<ExtendedTestContentScoreDocument>>(
      'ExtendedTestContentScoreModel',
    );
  });

  it('should be defined', () => {
    expect(contentScoreService).toBeDefined();
  });

  async function createGroupAndContent() {
    const { owner, member, profile } = await testDataUtils.createSimpleGroup();
    const content = new TestContent(profile, owner, { _id: getObjectId('TestContent') });
    return { owner, member, profile, content };
  }

  describe('Simple Content Score', () => {
    describe('saveScore', () => {
      it('initial data', async () => {
        const { owner, profile, content } = await createGroupAndContent();

        const ownerScore = new TestContentScore({
          user: owner,
          profile,
          content,
          score: 5,
          date: new Date(),
        });

        const model = await contentScoreService.saveScore(profile, ownerScore);
        expect(model._id).toBeDefined();
        expect(model.cid).toEqual(content._id);
        expect(model.pid).toEqual(profile._id);
        expect(model.oid).toEqual(profile.oid);
        expect(model.score).toEqual(5);
        expect(model.tid).toEqual(toTimingId(new Date()));
        expect(model.constructor.name).toEqual(TestContentScore.name);
        expect(model.type).toEqual(TestContentScore.name);
        expect(profile.score).toEqual(5);
      });

      it('save per user score', async () => {
        const { owner, member, profile, content } = await createGroupAndContent();

        const ownerScore = await contentScoreService.saveScore(
          profile,
          new TestContentScore({
            user: owner,
            profile,
            content,
            score: 5,
            userStrategy: UserAssignmentStrategy.PerUser,
            date: new Date(),
          }),
        );

        const memberScore = await contentScoreService.saveScore(
          profile,
          new TestContentScore({
            user: member,
            profile,
            content,
            score: -2,
            userStrategy: UserAssignmentStrategy.PerUser,
            date: new Date(),
          }),
        );

        expect(ownerScore._id).toBeDefined();
        expect(ownerScore.uid).toEqual(owner._id);
        expect(ownerScore.score).toEqual(5);

        expect(memberScore._id).toBeDefined();
        expect(memberScore.uid).toEqual(member._id);
        expect(memberScore.score).toEqual(-2);

        expect(profile.score).toEqual(3);
      });

      it('save shared score', async () => {
        const { owner, member, profile, content } = await createGroupAndContent();

        const ownerScore = await contentScoreService.saveScore(
          profile,
          new TestContentScore({
            user: owner,
            profile,
            content,
            score: 5,
            userStrategy: UserAssignmentStrategy.Shared,
            date: new Date(),
          }),
        );

        const memberScore = await contentScoreService.saveScore(
          profile,
          new TestContentScore({
            user: member,
            profile,
            content,
            score: -2,
            userStrategy: UserAssignmentStrategy.Shared,
            date: new Date(),
          }),
        );

        expect(ownerScore._id).toBeDefined();
        expect(ownerScore.uid).toBeNull();
        expect(ownerScore.score).toEqual(5);

        expect(memberScore._id).toBeDefined();
        expect(memberScore._id).not.toEqual(ownerScore._id);
        expect(memberScore.uid).toBeNull();
        expect(memberScore.score).toEqual(-2);

        expect(profile.score).toEqual(3);
      });
    });
  });

  describe('findScoreByContent', () => {
    it('find shared score', async () => {
      const { owner, member, profile, content } = await createGroupAndContent();

      await contentScoreService.saveScore(
        profile,
        new TestContentScore({
          user: owner,
          profile,
          content,
          score: 5,
          userStrategy: UserAssignmentStrategy.Shared,
          date: new Date(),
        }),
      );

      await contentScoreService.saveScore(
        profile,
        new TestContentScore({
          user: member,
          profile,
          content,
          score: 6,
          userStrategy: UserAssignmentStrategy.Shared,
          date: new Date(),
        }),
      );

      const search = await contentScoreService.findScoresByContent(
        profile,
        member,
        content,
        UserAssignmentStrategy.Shared,
      );
      expect(search.length).toEqual(2);
      expect(profile.score).toEqual(11);
    });

    it('find per user score', async () => {
      const { owner, member, profile, content } = await createGroupAndContent();

      const ownerScore = await contentScoreService.saveScore(
        profile,
        new TestContentScore({
          user: owner,
          profile,
          content,
          score: 5,
          userStrategy: UserAssignmentStrategy.PerUser,
          date: new Date(),
        }),
      );

      const memberScore = await contentScoreService.saveScore(
        profile,
        new TestContentScore({
          user: member,
          profile,
          content,
          score: -2,
          userStrategy: UserAssignmentStrategy.PerUser,
          date: new Date(),
        }),
      );

      const ownerSearch = await contentScoreService.findScoresByContent(
        profile,
        owner,
        content,
        UserAssignmentStrategy.PerUser,
      );
      expect(ownerSearch.length).toEqual(1);
      expect(ownerSearch[0]._id).toEqual(ownerScore._id);
      expect(ownerSearch[0].score).toEqual(5);
      const memberSearch = await contentScoreService.findScoresByContent(
        profile,
        member,
        content,
        UserAssignmentStrategy.PerUser,
      );
      expect(memberSearch.length).toEqual(1);
      expect(memberSearch[0]._id).toEqual(memberScore._id);
      expect(memberSearch[0].score).toEqual(-2);

      expect(profile.score).toEqual(3);
    });
  });

  describe('Extended Content Score', () => {
    it('assure validation of discriminator type works', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(profile, user, { _id: getObjectId('TestContent') });

      const testScore = new ExtendedTestContentScore({
        user,
        profile,
        content,
        score: 5,
        date: new Date(),
      });

      await expect(contentScoreService.saveScore(profile, testScore)).rejects.toThrow(Error);
    });
    it('save test score', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(profile, user, { _id: getObjectId('TestContent') });

      const testScore = new ExtendedTestContentScore(
        {
          user,
          profile,
          content,
          score: 5,
          date: new Date(),
        },
        { special: 'TestValue' },
      );

      const model = await contentScoreService.saveScore<ExtendedTestContentScore>(
        profile,
        testScore,
      );

      expect(model._id).toBeDefined();
      expect(model.cid).toEqual(content._id);
      expect(model.special).toEqual('TestValue');
      expect(model.getSpecialValue()).toEqual('_TestValue_');
      expect(model.pid).toEqual(profile._id);
      expect(model.oid).toEqual(profile.oid);
      expect(model.uid).toEqual(user._id);
      expect(model.score).toEqual(5);
      expect(model.tid).toEqual(toTimingId(new Date()));
      expect(model.constructor.name).toEqual(ExtendedTestContentScore.name);
      expect(model.type).toEqual(ExtendedTestContentScore.name);
    });

    it('assure discriminator is working', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(profile, user, { _id: getObjectId('TestContent') });

      const testScore = new ExtendedTestContentScore(
        {
          user,
          profile,
          content,
          score: 5,
          date: new Date(),
        },
        { special: 'TestValue' },
      );

      const model = await contentScoreService.saveScore(profile, testScore);

      const search1 = await TestContentScoreModel.find({}).exec();
      expect(search1.length).toEqual(0);

      const search2 = await ExtendedTestContentScoreModel.find({}).exec();
      expect(search2.length).toEqual(1);
      expect(search2[0]._id).toEqual(model._id);
    });
  });
});
