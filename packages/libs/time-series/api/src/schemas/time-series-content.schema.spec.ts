import { ILyvelyTestingModule } from '@lyvely/api';
import { INestApplication } from '@nestjs/common';
import { Content, ContentSchema, ProfileTestDataUtils, Model, buildContentTest } from '@lyvely/api';
import { TestTimeSeriesContent, TestTimeSeriesContentSchema } from '../testing';
import { CalendarInterval } from '@lyvely/dates';
import {
  DataPointValueType,
  DataPointInputType,
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  RangeNumberDataPointConfig,
} from '../index';

const ContentModels = [
  {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: [{ name: TestTimeSeriesContent.name, schema: TestTimeSeriesContentSchema }],
  },
];

describe('TimeSeriesContentSchema', () => {
  let testingModule: ILyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let TestTimeSeriesContentModel: Model<TestTimeSeriesContent>;

  const TEST_KEY = 'TimeSeriesContentSchema';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY).models(ContentModels).withApp().compile();
    testData = testingModule.get(ProfileTestDataUtils);
    TestTimeSeriesContentModel = testingModule.get('TestTimeSeriesContentModel');
  });

  afterEach(async () => {
    await testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('save()', () => {
    it('create content without logging config should fail', async () => {
      const { context } = await testData.createUserAndProfile();
      const model = new TestTimeSeriesContent(context, {
        config: {
          timeSeries: new CheckboxNumberDataPointConfig({
            interval: CalendarInterval.Daily,
            min: 0,
            max: 5,
            optimal: 3,
          }),
        },
      });

      delete (<any>model).config.timeSeries;

      expect.assertions(1);

      try {
        await new TestTimeSeriesContentModel(model).save();
      } catch (e) {
        expect((e as any).errors['config.timeSeries']).toBeDefined();
      }
    });

    it('create content with valid data point config', async () => {
      const { context } = await testData.createUserAndProfile();
      const model = new TestTimeSeriesContent(context, {
        config: {
          timeSeries: new CheckboxNumberDataPointConfig({
            interval: CalendarInterval.Daily,
            min: 0,
            max: 5,
            optimal: 3,
          }),
        },
      });

      const entity = new TestTimeSeriesContentModel(model);
      await entity.save();

      expect(entity._id).toBeDefined();
      const timeSeriesConfig = <CheckboxNumberDataPointConfig>entity.toObject().config.timeSeries;
      expect(timeSeriesConfig.strategy).toEqual(
        DataPointConfigFactory.getStrategyName(
          DataPointValueType.Number,
          DataPointInputType.Checkbox
        )
      );
      expect(timeSeriesConfig.min).toEqual(0);
      expect(timeSeriesConfig.max).toEqual(5);
      expect(timeSeriesConfig.optimal).toEqual(3);
    });
  });

  describe('save()', () => {
    it('construct data series content model from entity', async () => {
      const { context } = await testData.createUserAndProfile();
      const model = new TestTimeSeriesContent(context, {
        config: {
          timeSeries: new CheckboxNumberDataPointConfig({
            interval: CalendarInterval.Daily,
            min: 0,
            max: 5,
            optimal: 3,
          }),
        },
      });

      const entity = new TestTimeSeriesContentModel(model);
      await entity.save();

      const newModel = new TestTimeSeriesContent(context, entity.toObject());

      expect(newModel.id).toBeDefined();
      const timeSeriesConfig = <CheckboxNumberDataPointConfig>newModel.timeSeriesConfig;
      expect(timeSeriesConfig instanceof CheckboxNumberDataPointConfig).toEqual(true);
      expect(timeSeriesConfig.strategy).toEqual(
        DataPointConfigFactory.getStrategyName(
          DataPointValueType.Number,
          DataPointInputType.Checkbox
        )
      );
      expect(timeSeriesConfig.min).toEqual(0);
      expect(timeSeriesConfig.max).toEqual(5);
      expect(timeSeriesConfig.optimal).toEqual(3);
    });

    it('construct data series content model from entity', async () => {
      const { context } = await testData.createUserAndProfile();
      const model = new TestTimeSeriesContent(context, {
        config: {
          timeSeries: <CheckboxNumberDataPointConfig>{
            interval: CalendarInterval.Daily,
            strategy: DataPointConfigFactory.getStrategyName(
              DataPointValueType.Number,
              DataPointInputType.Range
            ),
            min: 0,
            max: 5,
            optimal: 3,
          },
        },
      });

      const timeSeriesConfig = <CheckboxNumberDataPointConfig>model.timeSeriesConfig;
      expect(timeSeriesConfig instanceof RangeNumberDataPointConfig).toEqual(true);
      expect(timeSeriesConfig.strategy).toEqual(
        DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Range)
      );
      expect(timeSeriesConfig.min).toEqual(0);
      expect(timeSeriesConfig.max).toEqual(5);
      expect(timeSeriesConfig.optimal).toEqual(3);
    });
  });
});
