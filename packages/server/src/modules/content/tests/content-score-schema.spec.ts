import { TestingModule } from '@nestjs/testing';
import { ProfileScore } from "../../profiles";
import { createBasicTestingModule, getObjectId } from "../../test/utils/test.utils";
import { ContentScore, ContentScoreSchema } from "../schemas";
import {
  ExtendedTestContentScore, ExtendedTestContentScoreDocument,
  ExtendedTestContentScoreSchema
} from "./src/test-content-score.schema";
import { Model } from 'mongoose';
import { expect } from "@jest/globals";
import { TestDataUtils } from "../../test/utils/test-data.utils";
import { TestContent } from "./src/test-content.schema";
import { toTimingId } from "@lyvely/common";

describe('ContentScore', () => {
    let testingModule: TestingModule;
    let testDataUtils: TestDataUtils;
    let ExtendedTestContentScoreModel: Model<ExtendedTestContentScoreDocument>

    const TEST_KEY = 'ContentScore';

    const Models = [ {
        name: ContentScore.name,
        collection: ProfileScore.collectionName(),
        schema: ContentScoreSchema,
        discriminators: [
            { name: ExtendedTestContentScore.name, schema: ExtendedTestContentScoreSchema }
        ],
    }];

    beforeEach(async () => {
        testingModule = await createBasicTestingModule(TEST_KEY, [], Models).compile();
        ExtendedTestContentScoreModel = testingModule.get<Model<ExtendedTestContentScoreDocument>>('ExtendedTestContentScoreModel')
        testDataUtils = testingModule.get<TestDataUtils>(TestDataUtils)
    });

    it('should be defined', () => {
        expect(ExtendedTestContentScoreModel).toBeDefined();
    });

    describe('constructor', () => {
      it('Construct ExtendedTestContentScoreModel', async () => {
        const { user, profile } = await testDataUtils.createUserAndProfile();
        profile.oid = getObjectId('MyOrg');
        const cid = getObjectId('MyContent');
        const content = new TestContent(profile, user, { _id: cid });
        const model = new ExtendedTestContentScore({
          user,
          profile,
          content,
          score: 5
        });
        expect(model.score).toEqual(5);
        expect(model.pid).toEqual(profile._id);
        expect(model.uid).toEqual(user._id);
        expect(model.oid).toEqual(profile.oid);
        expect(model.cid).toEqual(cid);
        expect(model.tid).toEqual(toTimingId(new Date()));
        expect(model.createdBy).toEqual(user._id);
      })
    })
});
