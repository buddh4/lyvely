import { ProfileScore, ProfileTestDataUtils } from '@/profiles';
import { getObjectId, ILyvelyTestingModule } from '@/testing';
import { ContentScore, ContentScoreSchema } from './index';
import {
  buildContentTest,
  ExtendedTestContentScore,
  ExtendedTestContentScoreSchema,
  TestContent,
} from '../testing';
import { Model } from '@/core';
import { toTimingId } from '@lyvely/dates';

describe('ContentScore', () => {
  let testingModule: ILyvelyTestingModule;
  let testDataUtils: ProfileTestDataUtils;
  let ExtendedTestContentScoreModel: Model<ExtendedTestContentScore>;

  const TEST_KEY = 'ContentScore';

  const Models = [
    {
      name: ContentScore.name,
      collection: ProfileScore.collectionName(),
      schema: ContentScoreSchema,
      discriminators: [
        { name: ExtendedTestContentScore.name, schema: ExtendedTestContentScoreSchema },
      ],
    },
  ];

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY).models(Models).compile();
    ExtendedTestContentScoreModel = testingModule.get('ExtendedTestContentScoreModel');
    testDataUtils = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  it('should be defined', () => {
    expect(ExtendedTestContentScoreModel).toBeDefined();
  });

  describe('constructor', () => {
    it('Construct ExtendedTestContentScoreModel', async () => {
      const { user, profile, context } = await testDataUtils.createUserAndProfile();
      profile.oid = getObjectId('MyOrg');
      const cid = getObjectId('MyContent');
      const content = new TestContent(context, { _id: cid });
      const model = new ExtendedTestContentScore({
        context,
        content,
        score: 5,
      });
      expect(model.score).toEqual(5);
      expect(model.pid).toEqual(profile._id);
      expect(model.uid).toEqual(user._id);
      expect(model.oid).toEqual(profile.oid);
      expect(model.cid).toEqual(cid);
      expect(model.tid).toEqual(toTimingId(new Date()));
      expect(model.createdBy).toEqual(user._id);
    });
  });
});
