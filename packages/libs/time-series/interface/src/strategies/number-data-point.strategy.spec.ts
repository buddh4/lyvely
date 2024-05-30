import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  NumberDataPointModel,
  useDataPointStrategyFacade,
} from '../index';
import { CalendarInterval, isToday, toTimingId } from '@lyvely/dates';

describe('NumberDataPointStrategy', () => {
  describe('validateValue', () => {
    it('valid number', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          <INumberDataPointConfig>{
            valueType: DataPointValueType.Number,
            min: 0,
            max: 5,
          },
          3
        )
      ).toEqual(true);
    });

    it('value > max should fail', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          <INumberDataPointConfig>{
            valueType: DataPointValueType.Number,
            min: 0,
            max: 5,
          },
          8
        )
      ).toEqual(false);
    });

    it('invalid value should fail', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          <INumberDataPointConfig>{
            valueType: DataPointValueType.Number,
            min: 0,
            max: 5,
          },
          '5'
        )
      ).toEqual(false);
    });
  });

  describe('prepareValue', () => {
    it('valid number', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          <INumberDataPointConfig>{
            valueType: DataPointValueType.Number,
            min: 0,
            max: 5,
          },
          3
        )
      ).toEqual(3);
    });

    it('respect max value', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          <INumberDataPointConfig>{
            valueType: DataPointValueType.Number,
            min: 0,
            max: 5,
          },
          8
        )
      ).toEqual(5);
    });

    it('invalid value should not be changed', () => {
      expect(
        useDataPointStrategyFacade().prepareValue(
          <INumberDataPointConfig>{
            valueType: DataPointValueType.Number,
            min: 0,
            max: 5,
          },
          '5'
        )
      ).toEqual('5');
    });
  });

  describe('prepareConfig', () => {
    it('assure default checkbox max value is 1', () => {
      const config = <INumberDataPointConfig>{
        valueType: DataPointValueType.Number,
        inputType: DataPointInputType.Checkbox,
      };
      useDataPointStrategyFacade().prepareConfig(config);
      expect(config.max).toEqual(1);
    });

    it('assure max checkbox value is 8', () => {
      const config = <INumberDataPointConfig>{
        valueType: DataPointValueType.Number,
        inputType: DataPointInputType.Checkbox,
        max: 20,
      };
      useDataPointStrategyFacade().prepareConfig(config);
      expect(config.max).toEqual(8);
    });
  });

  describe('createDataPoint', () => {
    it('create number data point', () => {
      const tid = toTimingId(new Date());
      const dataPoint = useDataPointStrategyFacade().createDataPoint({
        id: 'dt1',
        cid: '1',
        tid,
        valueType: DataPointValueType.Number,
        value: 5,
        interval: CalendarInterval.Daily,
        date: new Date(),
      });

      expect(dataPoint).toBeDefined();
      expect(dataPoint instanceof NumberDataPointModel).toEqual(true);
      expect(dataPoint.id).toEqual('dt1');
      expect(dataPoint.cid).toEqual('1');
      expect(dataPoint.tid).toEqual(tid);
      expect(dataPoint.valueType).toEqual(DataPointValueType.Number);
      expect(dataPoint.value).toEqual(5);
      expect(dataPoint.interval).toEqual(CalendarInterval.Daily);
      expect(isToday(dataPoint.date)).toEqual(true);
    });
  });
});
