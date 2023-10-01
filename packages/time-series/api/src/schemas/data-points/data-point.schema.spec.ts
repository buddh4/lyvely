import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { Model } from 'mongoose';
import { NumberDataPoint, NumberDataPointSchema } from '../index';
import { profilesTestPlugin, ProfileTestDataUtils } from '@lyvely/profiles';

const DataPointModelDefinition = [
  { name: NumberDataPoint.name, collection: 'testDataPoints', schema: NumberDataPointSchema },
];

describe('NumberTimingDataPointSchema', () => {
  let testingModule: LyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let TestNumberDataPointModel: Model<NumberDataPoint>;

  const TEST_KEY = 'NumberTimingDataPointSchema';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin])
      .models(DataPointModelDefinition)
      .compile();
    testData = testingModule.get(ProfileTestDataUtils);
    TestNumberDataPointModel = testingModule.get<Model<NumberDataPoint>>('NumberDataPointModel');
  });

  afterEach(async () => {
    testingModule.afterEach();
  });

  it('should be defined', () => {
    expect(TestNumberDataPointModel).toBeDefined();
  });
});
