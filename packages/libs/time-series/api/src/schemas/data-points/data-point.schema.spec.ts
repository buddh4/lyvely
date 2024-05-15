import { ILyvelyTestingModule } from '@lyvely/testing';
import { Model, buildContentTest } from '@lyvely/api';
import { NumberDataPoint, NumberDataPointSchema } from '../index';

const DataPointModelDefinition = [
  { name: NumberDataPoint.name, collection: 'testDataPoints', schema: NumberDataPointSchema },
];

describe('NumberTimingDataPointSchema', () => {
  let testingModule: ILyvelyTestingModule;
  let TestNumberDataPointModel: Model<NumberDataPoint>;

  const TEST_KEY = 'NumberTimingDataPointSchema';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY).models(DataPointModelDefinition).compile();
    TestNumberDataPointModel = testingModule.get<Model<NumberDataPoint>>('NumberDataPointModel');
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(TestNumberDataPointModel).toBeDefined();
  });
});
