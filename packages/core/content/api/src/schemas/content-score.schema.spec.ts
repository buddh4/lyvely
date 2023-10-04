import { ProfileScore, profilesTestPlugin, ProfileTestDataUtils } from '@lyvely/profiles';
import { getObjectId, buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { ContentScore, ContentScoreSchema } from './index';
import {
  ExtendedTestContentScore,
  ExtendedTestContentScoreDocument,
  ExtendedTestContentScoreSchema,
  contentTestPlugin,
  TestContent,
} from '../testing';
import { Model } from 'mongoose';
import { toTimingId } from '@lyvely/dates';

describe('ContentScore', () => {
  let testingModule: LyvelyTestingModule;
  let testDataUtils: ProfileTestDataUtils;
  let ExtendedTestContentScoreModel: Model<ExtendedTestContentScoreDocument>;

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
    testingModule = await buildTest(TEST_KEY)
      .plugins([contentTestPlugin, profilesTestPlugin])
      .models(Models)
      .compile();
    ExtendedTestContentScoreModel = testingModule.get<Model<ExtendedTestContentScoreDocument>>(
      'ExtendedTestContentScoreModel',
    );
    testDataUtils = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
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
