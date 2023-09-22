import { TimeSeriesStore } from './time-series.store';
import {
  DataPointValueType,
  IDataPointConfig,
  NumberDataPointModel,
  TextDataPointModel,
  TimeSeriesContentModel,
} from '@/time-series';
import { CalendarInterval } from '@lyvely/dates';
import { toTimingId } from '@lyvely/calendar-plan';
import { IContentMetadata } from '@lyvely/content';

describe('TimeSeriesStore', () => {
  describe('createDataPoint', () => {
    it('number data point', () => {
      const store = new TimeSeriesStore();
      const interval = CalendarInterval.Daily;
      const model = new TimeSeriesContentModel({
        id: '1',
        type: 'test',
        config: {
          timeSeries: <IDataPointConfig>{ interval, valueType: DataPointValueType.Number },
        },
      });

      const tid = toTimingId(new Date(), interval);
      const dataPoint = store.createDataPoint(model, tid);
      expect(dataPoint).toBeDefined();
      expect(dataPoint instanceof NumberDataPointModel).toEqual(true);
      expect(dataPoint.valueType).toEqual(DataPointValueType.Number);
      expect(dataPoint.cid).toEqual('1');
      expect(dataPoint.tid).toEqual(tid);
      expect(dataPoint.interval).toEqual(interval);
      expect(dataPoint.value).toEqual(0);
      expect(dataPoint.id).toBeUndefined();
    });

    it('text data point', () => {
      const store = new TimeSeriesStore();
      const interval = CalendarInterval.Daily;
      const model = new TimeSeriesContentModel({
        id: '1',
        type: 'test',
        config: {
          timeSeries: <IDataPointConfig>{ interval, valueType: DataPointValueType.Text },
        },
      });

      const tid = toTimingId(new Date(), interval);
      const dataPoint = store.createDataPoint(model, tid);
      expect(dataPoint).toBeDefined();
      expect(dataPoint instanceof TextDataPointModel).toEqual(true);
      expect(dataPoint.valueType).toEqual(DataPointValueType.Text);
      expect(dataPoint.cid).toEqual('1');
      expect(dataPoint.tid).toEqual(tid);
      expect(dataPoint.interval).toEqual(interval);
      expect(dataPoint.value).toEqual('');
      expect(dataPoint.id).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('reset store', () => {
      const interval = CalendarInterval.Daily;
      const tid = toTimingId(new Date(), interval);
      const store = new TimeSeriesStore(
        [
          new TimeSeriesContentModel({
            id: '1',
            config: {
              timeSeries: <IDataPointConfig>{ interval, valueType: DataPointValueType.Number },
            },
          }),
          new TimeSeriesContentModel({
            id: '2',
            config: {
              timeSeries: <IDataPointConfig>{ interval, valueType: DataPointValueType.Number },
            },
          }),
        ],
        [new NumberDataPointModel({ cid: '1', tid }), new NumberDataPointModel({ cid: '2', tid })],
      );

      expect(store.getModels().length).toEqual(2);
      expect(store.getDataPoints().length).toEqual(2);

      store.reset();

      expect(store.getModels().length).toEqual(0);
      expect(store.getDataPoints().length).toEqual(0);
    });
  });

  describe('sort', () => {
    it('sort models', () => {
      const store = new TimeSeriesStore();
      const result = store.sort([
        new TimeSeriesContentModel({
          id: '1',
          meta: <IContentMetadata>{ sortOrder: 1 },
        }),
        new TimeSeriesContentModel({
          id: '2',
          meta: <IContentMetadata>{ sortOrder: 0 },
        }),
      ]);

      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('2');
      expect(result[1].id).toEqual('1');
    });
  });

  describe('setModel', () => {
    it('add model', () => {
      const store = new TimeSeriesStore();
      store.setModel(new TimeSeriesContentModel({ id: '2' }));
      const models = store.getModels();
      expect(models.length).toEqual(1);
      expect(models[0].id).toEqual('2');
    });

    it('overwrite model', () => {
      const store = new TimeSeriesStore();
      store.setModel(new TimeSeriesContentModel({ id: '2' }));
      store.setModel(new TimeSeriesContentModel({ id: '2', type: 'test' }));
      const models = store.getModels();
      expect(models.length).toEqual(1);
      expect(models[0].id).toEqual('2');
      expect(models[0].type).toEqual('test');
    });
  });

  describe('setModels', () => {
    it('add multiple models', () => {
      const store = new TimeSeriesStore();
      store.setModels([
        new TimeSeriesContentModel({ id: '1' }),
        new TimeSeriesContentModel({ id: '2' }),
      ]);
      const models = store.getModels();
      expect(models.length).toEqual(2);
      expect(models[0].id).toEqual('1');
      expect(models[1].id).toEqual('2');
    });

    it('overwrite multiple models', () => {
      const store = new TimeSeriesStore();
      store.setModels([
        new TimeSeriesContentModel({ id: '1' }),
        new TimeSeriesContentModel({ id: '2' }),
      ]);
      store.setModels([
        new TimeSeriesContentModel({ id: '1', type: 'test' }),
        new TimeSeriesContentModel({ id: '2', type: 'test' }),
      ]);
      const models = store.getModels();
      expect(models.length).toEqual(2);
      expect(models[0].id).toEqual('1');
      expect(models[0].type).toEqual('test');
      expect(models[1].id).toEqual('2');
      expect(models[1].type).toEqual('test');
    });
  });
});
