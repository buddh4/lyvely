import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createTestingModule } from '../../test/utils/test.utils';
import { INestApplication } from '@nestjs/common';
import { Content, ContentSchema } from '../../content';
import {
  TestTimeSeriesContent,
  TestTimeSeriesContentDocument,
  TestTimeSeriesContentSchema
} from './src/test-time-series-content.schema';
import { Model } from 'mongoose';
import { CalendarIntervalEnum, DataPointInputStrategy } from 'lyvely-common';
import { CheckboxNumberDataPointConfig, RangeNumberDataPointConfig } from '../schemas';

const ContentModels = [
  {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: [
      { name: TestTimeSeriesContent.name, schema: TestTimeSeriesContentSchema },
    ],
  }
];

describe('TimeableContentSchema', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let app: INestApplication;
  let TestTimeSeriesContentModel: Model<TestTimeSeriesContentDocument>;

  const TEST_KEY = 'TimeableContentSchema';

  beforeEach(async () => {
    testingModule = await createTestingModule(TEST_KEY, [], ContentModels).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    TestTimeSeriesContentModel = testingModule.get<Model<TestTimeSeriesContentDocument>>('TestTimeSeriesContentModel');
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
    await app.close();
  });

  it('should be defined', () => {
    expect(TestTimeSeriesContentModel).toBeDefined();
  });

  describe('save()', () => {
    it('create content without logging config should fail', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const model = new TestTimeSeriesContent(user, profile, {
        someTestField: 'Testing...',
        interval: CalendarIntervalEnum.Daily,
        dataPointConfig: new CheckboxNumberDataPointConfig({ min: 0, max: 5, optimal: 3 })
      });

      delete model.dataPointConfig;

      const entity = new TestTimeSeriesContentModel(model);

      try {
        await entity.save();
      } catch (e) {
        expect(e.errors?.dataPointConfig).toBeDefined();
      }
    });

    it('create content with valid data point config', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const model = new TestTimeSeriesContent(user, profile, {
        someTestField: 'Testing...',
        interval: CalendarIntervalEnum.Daily,
        dataPointConfig: new CheckboxNumberDataPointConfig({ min: 0, max: 5, optimal: 3 })
      });

      const entity = new TestTimeSeriesContentModel(model);
      await entity.save();

      expect(entity._id).toBeDefined();
      const dataPointConfig = <CheckboxNumberDataPointConfig> entity.dataPointConfig;
      expect(dataPointConfig.strategy).toEqual(DataPointInputStrategy.CheckboxNumber);
      expect(dataPointConfig.min).toEqual(0);
      expect(dataPointConfig.max).toEqual(5);
      expect(dataPointConfig.optimal).toEqual(3);
    });
  });

  describe('save()', () => {
    it('construct data series content model from entity', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const model = new TestTimeSeriesContent(user, profile, {
        someTestField: 'Testing...',
        interval: CalendarIntervalEnum.Daily,
        dataPointConfig: new CheckboxNumberDataPointConfig({ min: 0, max: 5, optimal: 3 })
      });

      const entity = new TestTimeSeriesContentModel(model);
      await entity.save();

      const newModel = new TestTimeSeriesContent(entity);

      expect(newModel.id).toBeDefined();
      const dataPointConfig = <CheckboxNumberDataPointConfig> newModel.dataPointConfig;
      expect(dataPointConfig instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(dataPointConfig.strategy).toEqual(DataPointInputStrategy.CheckboxNumber);
      expect(dataPointConfig.min).toEqual(0);
      expect(dataPointConfig.max).toEqual(5);
      expect(dataPointConfig.optimal).toEqual(3);
    });

    it('construct data series content model from entity', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const model = new TestTimeSeriesContent(user, profile, {
        someTestField: 'Testing...',
        interval: CalendarIntervalEnum.Daily,
        dataPointConfig: <CheckboxNumberDataPointConfig> { strategy: DataPointInputStrategy.RangeNumber, min: 0, max: 5, optimal: 3 }
      });

      const dataPointConfig = <CheckboxNumberDataPointConfig> model.dataPointConfig;
      expect(dataPointConfig instanceof RangeNumberDataPointConfig).toEqual(true);
      expect(dataPointConfig.strategy).toEqual(DataPointInputStrategy.RangeNumber);
      expect(dataPointConfig.min).toEqual(0);
      expect(dataPointConfig.max).toEqual(5);
      expect(dataPointConfig.optimal).toEqual(3);
    });
  });
});
