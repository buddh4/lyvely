import {
  DataPointValueType,
  ITextDataPointConfig,
  TextDataPointModel,
  useDataPointStrategyFacade,
} from '../index';
import { CalendarInterval, isToday } from '@lyvely/dates';
import { toTimingId } from '@lyvely/dates';

describe('TextDataPointStrategy', () => {
  describe('validateValue', () => {
    it('valid string', () => {
      expect(
        useDataPointStrategyFacade().validateValue(
          <ITextDataPointConfig>{
            valueType: DataPointValueType.Text,
          },
          'Test',
        ),
      ).toEqual(true);
    });

    it('empty value', () => {
      expect(
        useDataPointStrategyFacade().validateValue(
          <ITextDataPointConfig>{
            valueType: DataPointValueType.Text,
          },
          '',
        ),
      ).toEqual(false);
    });

    it('empty text', () => {
      expect(
        useDataPointStrategyFacade().validateValue(
          <ITextDataPointConfig>{
            valueType: DataPointValueType.Text,
          },
          ' ',
        ),
      ).toEqual(false);
    });

    it('invalid value should fail', () => {
      expect(
        useDataPointStrategyFacade().validateValue(
          <ITextDataPointConfig>{
            valueType: DataPointValueType.Text,
          },
          5,
        ),
      ).toEqual(false);
    });
  });

  describe('prepareValue', () => {
    it('valid text', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          <ITextDataPointConfig>{
            valueType: DataPointValueType.Text,
          },
          'Test',
        ),
      ).toEqual('Test');
    });

    it('trim text', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          <ITextDataPointConfig>{
            valueType: DataPointValueType.Text,
          },
          ' Test ',
        ),
      ).toEqual('Test');
    });

    it('invalid value should not be changed', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          <ITextDataPointConfig>{
            valueType: DataPointValueType.Text,
          },
          5,
        ),
      ).toEqual(5);
    });
  });

  describe('prepareConfig', () => {
    it('prepare should not change settings', () => {
      const config = <ITextDataPointConfig>{
        valueType: DataPointValueType.Text,
        required: true,
      };
      useDataPointStrategyFacade().prepareConfig(config);
      expect(config.required).toEqual(true);
    });
  });

  describe('createDataPoint', () => {
    it('create number data point', () => {
      const tid = toTimingId(new Date());
      const dataPoint = useDataPointStrategyFacade().createDataPoint({
        id: 'dt1',
        cid: '1',
        tid,
        valueType: DataPointValueType.Text,
        value: 'Hello',
        interval: CalendarInterval.Daily,
        date: new Date(),
      });

      expect(dataPoint).toBeDefined();
      expect(dataPoint instanceof TextDataPointModel).toEqual(true);
      expect(dataPoint.id).toEqual('dt1');
      expect(dataPoint.cid).toEqual('1');
      expect(dataPoint.tid).toEqual(tid);
      expect(dataPoint.valueType).toEqual(DataPointValueType.Text);
      expect(dataPoint.value).toEqual('Hello');
      expect(dataPoint.interval).toEqual(CalendarInterval.Daily);
      expect(isToday(dataPoint.date)).toEqual(true);
    });
  });
});
