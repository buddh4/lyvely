import { ProfileScore, ProfileTestDataUtils } from '@/profiles';
import { getObjectId, ILyvelyTestingModule } from '@/testing';
import { ContentScore, ContentScoreSchema } from '../schemas';
import {
  ExtendedTestContentScore,
  ExtendedTestContentScoreSchema,
  TestContentScore,
  TestContentScoreSchema,
  TestContent,
  buildContentTest,
} from '../testing';
import { Model } from '@/core';
import { ContentScoreService } from './index';
import { ContentScoreDao } from '../daos';
import { toTimingId } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/api';

describe('ContentScoreService', () => {
  let testingModule: ILyvelyTestingModule;
  let testDataUtils: ProfileTestDataUtils;
  let TestContentScoreModel: Model<TestContentScore>;
  let ExtendedTestContentScoreModel: Model<ExtendedTestContentScore>;
  let contentScoreService: ContentScoreService;

  const TEST_KEY = 'ContentScoreService';

  const Models = [
    {
      name: ContentScore.name,
      collection: ProfileScore.collectionName(),
      schema: ContentScoreSchema,
      discriminators: [
        { name: TestContentScore.name, schema: TestContentScoreSchema },
        {
          name: ExtendedTestContentScore.name,
          schema: ExtendedTestContentScoreSchema,
        },
      ],
    },
  ];

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY)
      .providers([ContentScoreService, ContentScoreDao])
      .models(Models)
      .compile();
    contentScoreService = testingModule.get<ContentScoreService>(ContentScoreService);
    testDataUtils = testingModule.get(ProfileTestDataUtils);
    TestContentScoreModel = testingModule.get('TestContentScoreModel');
    ExtendedTestContentScoreModel = testingModule.get('ExtendedTestContentScoreModel');
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(contentScoreService).toBeDefined();
  });

  async function createGroupAndContent() {
    const testData = await testDataUtils.createSimpleGroup();
    const content = new TestContent(testData.ownerContext, {
      _id: getObjectId('TestContent'),
      type: TestContent.name,
    });
    return { ...testData, content };
  }

  describe('Simple Content Score', () => {
    describe('saveScore', () => {
      it('initial data', async () => {
        const { ownerContext, profile, content } = await createGroupAndContent();

        const ownerScore = new TestContentScore({
          context: ownerContext,
          content,
          score: 5,
          date: new Date(),
        });

        const model = await contentScoreService.saveScore(ownerContext, ownerScore);
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
        const { owner, ownerContext, member, memberContext, profile, content } =
          await createGroupAndContent();

        const ownerScore = await contentScoreService.saveScore(
          ownerContext,
          new TestContentScore({
            context: ownerContext,
            content,
            score: 5,
            userStrategy: UserAssignmentStrategy.PerUser,
            date: new Date(),
          }),
        );

        const memberScore = await contentScoreService.saveScore(
          memberContext,
          new TestContentScore({
            context: memberContext,
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
        const { owner, ownerContext, member, memberContext, profile, content } =
          await createGroupAndContent();

        const ownerScore = await contentScoreService.saveScore(
          ownerContext,
          new TestContentScore({
            context: ownerContext,
            content,
            score: 5,
            userStrategy: UserAssignmentStrategy.Shared,
            date: new Date(),
          }),
        );

        const memberScore = await contentScoreService.saveScore(
          memberContext,
          new TestContentScore({
            context: memberContext,
            content,
            score: -2,
            userStrategy: UserAssignmentStrategy.Shared,
            date: new Date(),
          }),
        );

        expect(ownerScore._id).toBeDefined();
        expect(ownerScore.uid).toEqual(owner._id);
        expect(ownerScore.score).toEqual(5);

        expect(memberScore._id).toBeDefined();
        expect(memberScore._id).not.toEqual(ownerScore._id);
        expect(memberScore.uid).toEqual(member._id);
        expect(memberScore.score).toEqual(-2);

        expect(profile.score).toEqual(3);
      });
    });
  });

  describe('findScoreByContent', () => {
    it('find shared score', async () => {
      const { ownerContext, memberContext, profile, content } = await createGroupAndContent();

      await contentScoreService.saveScore(
        ownerContext,
        new TestContentScore({
          context: ownerContext,
          content,
          score: 5,
          userStrategy: UserAssignmentStrategy.Shared,
          date: new Date(),
        }),
      );

      await contentScoreService.saveScore(
        memberContext,
        new TestContentScore({
          context: memberContext,
          content,
          score: 6,
          userStrategy: UserAssignmentStrategy.Shared,
          date: new Date(),
        }),
      );

      const search = await contentScoreService.findScoresByContent(
        memberContext,
        content,
        UserAssignmentStrategy.Shared,
      );
      expect(search.length).toEqual(2);
      expect(profile.score).toEqual(11);
    });

    it('find per user score', async () => {
      const { ownerContext, memberContext, profile, content } = await createGroupAndContent();

      const ownerScore = await contentScoreService.saveScore(
        ownerContext,
        new TestContentScore({
          context: ownerContext,
          content,
          score: 5,
          userStrategy: UserAssignmentStrategy.PerUser,
          date: new Date(),
        }),
      );

      const memberScore = await contentScoreService.saveScore(
        memberContext,
        new TestContentScore({
          context: memberContext,
          content,
          score: -2,
          userStrategy: UserAssignmentStrategy.PerUser,
          date: new Date(),
        }),
      );

      const ownerSearch = await contentScoreService.findScoresByContent(
        ownerContext,
        content,
        UserAssignmentStrategy.PerUser,
      );
      expect(ownerSearch.length).toEqual(1);
      expect(ownerSearch[0]._id).toEqual(ownerScore._id);
      expect(ownerSearch[0].score).toEqual(5);
      const memberSearch = await contentScoreService.findScoresByContent(
        memberContext,
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
    /*it('assure validation of discriminator type works', async () => {
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
    });*/
    it('save test score', async () => {
      const { user, context, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(context, {
        _id: getObjectId('TestContent'),
        type: TestContent.name,
      });

      const testScore = new ExtendedTestContentScore(
        {
          context,
          content,
          score: 5,
          date: new Date(),
        },
        { special: 'TestValue' },
      );

      const model = await contentScoreService.saveScore<ExtendedTestContentScore>(
        context,
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
      const { context } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(context, {
        _id: getObjectId('TestContent'),
        type: TestContent.name,
      });

      const testScore = new ExtendedTestContentScore(
        {
          context,
          content,
          score: 5,
          date: new Date(),
        },
        { special: 'TestValue' },
      );

      const model = await contentScoreService.saveScore(context, testScore);

      const search1 = await TestContentScoreModel.find({}).exec();
      expect(search1.length).toEqual(0);

      const search2 = await ExtendedTestContentScoreModel.find({}).exec();
      expect(search2.length).toEqual(1);
      expect(search2[0]._id).toEqual(model._id);
    });
  });
});
