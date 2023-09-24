import { DataPointValueType, ITimerDataPointConfig, useDataPointStrategyFacade } from '../index';
import { CalendarInterval, isToday } from '@lyvely/dates';
import { TimerDataPointModel } from '../models';
import { toTimingId } from '@lyvely/dates';

describe('TimerDataPointStrategy', () => {
  describe('validateValue', () => {
    it('valid number', async () => {
      expect(
        await useDataPointStrategyFacade().validateValue(
          <ITimerDataPointConfig>{
            valueType: DataPointValueType.Timer,
            min: 0,
            max: 5,
          },
          3,
        ),
      ).toEqual(true);
    });
  });

  describe('prepareValue', () => {});

  describe('prepareConfig', () => {});

  describe('createDataPoint', () => {
    it('create number data point', () => {
      const tid = toTimingId(new Date());
      const dataPoint = useDataPointStrategyFacade().createDataPoint({
        id: 'dt1',
        cid: '1',
        tid,
        valueType: DataPointValueType.Timer,
        value: 5,
        interval: CalendarInterval.Daily,
        date: new Date(),
      });

      expect(dataPoint).toBeDefined();
      expect(dataPoint instanceof TimerDataPointModel).toEqual(true);
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
