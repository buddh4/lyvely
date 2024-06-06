import { DataPointValueType, ITimerDataPointConfig, useDataPointStrategyFacade } from '../index';
import { CalendarInterval, isToday, toTimingId } from '@lyvely/dates';
import { TimerDataPointModel } from '../models';
import { TimerModel } from '@lyvely/interface';

describe('TimerDataPointStrategy', () => {
  describe('validateValue', () => {
    it('valid init timer', async () => {
      const timer = new TimerModel();
      expect(
        await useDataPointStrategyFacade().validateValue(
          <ITimerDataPointConfig>{
            valueType: DataPointValueType.Timer,
            min: 0,
            max: 5,
          },
          { timer, ms: 0 }
        )
      ).toEqual(true);
    });
    it('valid started timer', async () => {
      const timer = new TimerModel();
      timer.start();
      expect(
        await useDataPointStrategyFacade().validateValue(
          <ITimerDataPointConfig>{
            valueType: DataPointValueType.Timer,
            min: 0,
            max: 5,
          },
          { timer, ms: timer.calculateTotalSpan() }
        )
      ).toEqual(true);
    });
    it('valid stopped timer', async () => {
      const timer = new TimerModel();
      timer.start();
      timer.stop();
      expect(
        await useDataPointStrategyFacade().validateValue(
          <ITimerDataPointConfig>{
            valueType: DataPointValueType.Timer,
            min: 0,
            max: 5,
          },
          { timer, ms: timer.calculateTotalSpan() }
        )
      ).toEqual(true);
    });
  });

  describe('createDataPoint', () => {
    const timer = new TimerModel();
    const value = { timer, ms: timer.calculateTotalSpan() };
    it('create number data point', () => {
      const tid = toTimingId(new Date());
      const dataPoint = useDataPointStrategyFacade().createDataPoint({
        id: 'dt1',
        cid: '1',
        tid,
        valueType: DataPointValueType.Timer,
        value,
        interval: CalendarInterval.Daily,
        date: new Date(),
      });

      expect(dataPoint).toBeDefined();
      expect(dataPoint instanceof TimerDataPointModel).toEqual(true);
      expect(dataPoint.id).toEqual('dt1');
      expect(dataPoint.cid).toEqual('1');
      expect(dataPoint.tid).toEqual(tid);
      expect(dataPoint.valueType).toEqual(DataPointValueType.Timer);
      expect(dataPoint.value).toEqual(value);
      expect(dataPoint.interval).toEqual(CalendarInterval.Daily);
      expect(isToday(dataPoint.date)).toEqual(true);
    });
  });
});
