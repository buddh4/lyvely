import {
  DataPointValueType,
  ITimerDataPointConfig,
  TimerDataPointStrategy,
  useDataPointStrategyFacade
} from '../index';
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

  describe('prepareConfig', () => {
    const timerStrategy = new TimerDataPointStrategy();
    it('min > max', () => {
      const config = {
        min: 20_000,
        max: 10_000,
        optimal: 15_000,
      } as any;
      timerStrategy.prepareConfig(config);
      expect(config).toEqual({
        min: 20_000,
        max: 20_000,
        optimal: 20_000,
      })
    });

    it('max > min', () => {
      const config = {
        max: 20_000,
        min: 10_000,
        optimal: 15_000,
      } as any;
      timerStrategy.prepareConfig(config);
      expect(config).toEqual({
        max: 20_000,
        min: 10_000,
        optimal: 15_000,
      })
    });

    it('min > optiomal', () => {
      const config = {
        min: 20_000,
        optimal: 15_000,
      } as any;
      timerStrategy.prepareConfig(config);
      expect(config).toEqual({
        min: 20_000,
        max: 20_000,
        optimal: 20_000,
      })
    });

    it('max < min', () => {
      const config = {
        min: 10_000,
        max: 20_000,
      } as any;
      timerStrategy.prepareConfig(config);
      expect(config).toEqual({
        min: 10_000,
        max: 20_000,
      })
    });

    it('max < min', () => {
      const config = {
        min: 10_000,
        max: 20_000,
      } as any;
      timerStrategy.prepareConfig(config);
      expect(config).toEqual({
        min: 10_000,
        max: 20_000,
      })
    });

    it('min < MIN_VALUE', () => {
      const config = { min: 3 } as any;
      timerStrategy.prepareConfig(config);
      expect(config).toEqual({
        min: 10_000,
        max: 10_000,
      })
    });
  });
});
