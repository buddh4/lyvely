import { TestDataUtils } from "../../test/utils/test-data.utils";
import { TestingModule } from '@nestjs/testing';
import { ProfileScore } from "../../profiles";
import { createBasicTestingModule, getObjectId } from "../../test/utils/test.utils";
import { ContentScore, ContentScoreSchema } from "../schemas";
import {
  ExtendedTestContentScore, ExtendedTestContentScoreDocument, ExtendedTestContentScoreSchema,
  TestContentScore,
  TestContentScoreDocument,
  TestContentScoreSchema
} from "./src/test-content-score.schema";
import { Model } from 'mongoose';
import { expect } from "@jest/globals";
import { ContentScoreService } from "../services";
import { ContentScoreDao } from "../daos";
import { toTimingId } from "lyvely-common/src";
import { TestContent } from "./src/test-content.schema";

describe('ContentScoreService', () => {
  let testingApp: TestingModule;
  let testDataUtils: TestDataUtils;
  let TestContentScoreModel: Model<TestContentScoreDocument>;
  let ExtendedTestContentScoreModel: Model<ExtendedTestContentScoreDocument>;
  let contentScoreActionService: ContentScoreService;

  const TEST_KEY = 'ContentScoreService';

  const Models = [{
    name: ContentScore.name,
    collection: ProfileScore.collectionName(),
    schema: ContentScoreSchema,
    discriminators: [
      { name: TestContentScore.name, schema: TestContentScoreSchema },
      { name: ExtendedTestContentScore.name, schema: ExtendedTestContentScoreSchema }
    ],
  }];

  beforeEach(async () => {
    testingApp = await createBasicTestingModule(TEST_KEY, [ContentScoreService, ContentScoreDao], Models).compile();
    contentScoreActionService = testingApp.get<ContentScoreService>(ContentScoreService);
    testDataUtils = testingApp.get<TestDataUtils>(TestDataUtils);
    TestContentScoreModel = testingApp.get<Model<TestContentScoreDocument>>('TestContentScoreModel');
    ExtendedTestContentScoreModel = testingApp.get<Model<ExtendedTestContentScoreDocument>>('ExtendedTestContentScoreModel');
  });

  it('should be defined', () => {
    expect(contentScoreActionService).toBeDefined();
  });

  describe('Simple Content Score', () => {
    it('save test score', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(user, profile,{ _id: getObjectId('TestContent') });

      const testScore = new TestContentScore({
        user,
        profile,
        content,
        score: 5,
        date: new Date(),
      });

      const model = await contentScoreActionService.saveScore(profile, testScore);

      expect(model._id).toBeDefined();
      expect(model.cid).toEqual(content._id);
      expect(model.pid).toEqual(profile._id);
      expect(model.oid).toBeUndefined();
      expect(model.uid).toEqual(user._id);
      expect(model.score).toEqual(5);
      expect(model.timing).toBeDefined();
      expect(model.timing.tid).toEqual(toTimingId(new Date()));
      expect(model.constructor.name).toEqual(TestContentScore.name);
      expect(model.type).toEqual(TestContentScore.name);
    })

    it('assure discriminator is working', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(user, profile,{ _id: getObjectId('TestContent') });

      const testScore = new TestContentScore({
        user,
        profile,
        content,
        score: 5,
        date: new Date(),
      });

      const model = await contentScoreActionService.saveScore(profile, testScore);

      const search = await TestContentScoreModel.find({}).exec();
      expect(search.length).toEqual(1);
      expect(search[0]._id).toEqual(model._id);
    });
  });

  describe('Extended Content Score', () => {
    it('assure validation of discriminator type works', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(user, profile,{ _id: getObjectId('TestContent') });

      const testScore = new ExtendedTestContentScore({
        user,
        profile,
        content,
        score: 5,
        date: new Date()
      });

      await expect(contentScoreActionService.saveScore(profile, testScore)).rejects.toThrow(Error);
    })
    it('save test score', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(user, profile,{ _id: getObjectId('TestContent') });

      const testScore = new ExtendedTestContentScore({
        user,
        profile,
        content,
        score: 5,
        date: new Date()
      }, { special: 'TestValue' });

      const model = await contentScoreActionService.saveScore<ExtendedTestContentScore>(profile, testScore);

      expect(model._id).toBeDefined();
      expect(model.cid).toEqual(content._id);
      expect(model.special).toEqual('TestValue');
      expect(model.getSpecialValue()).toEqual('_TestValue_');
      expect(model.pid).toEqual(profile._id);
      expect(model.oid).toBeUndefined();
      expect(model.uid).toEqual(user._id);
      expect(model.score).toEqual(5);
      expect(model.timing).toBeDefined();
      expect(model.timing.tid).toEqual(toTimingId(new Date()));
      expect(model.constructor.name).toEqual(ExtendedTestContentScore.name);
      expect(model.type).toEqual(ExtendedTestContentScore.name);
    })

    it('assure discriminator is working', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const content = new TestContent(user, profile,{ _id: getObjectId('TestContent') });

      const testScore = new ExtendedTestContentScore({
        user,
        profile,
        content,
        score: 5,
        date: new Date(),
      }, { special: 'TestValue' });

      const model = await contentScoreActionService.saveScore(profile, testScore);

      const search1 = await TestContentScoreModel.find({}).exec();
      expect(search1.length).toEqual(0);

      const search2 = await ExtendedTestContentScoreModel.find({}).exec();
      expect(search2.length).toEqual(1);
      expect(search2[0]._id).toEqual(model._id);
    });
  });

});
