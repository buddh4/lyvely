import { UpdateHabitModel } from './update-habit.model';
import { UpdateHabitDataPointModel } from './update-habit-data-point.model';
import { CalendarIntervalEnum } from '@/calendar';
import { validate } from 'class-validator';

describe('Activity Model', () => {
  describe('UpdateHabitModel', function () {
    it('validate valid dto', async () => {
      const dto = new UpdateHabitModel({
        title: 'Test activity',
        text: 'This is my test activity',
        interval: CalendarIntervalEnum.Daily,
        min: 0,
        optimal: 0,
        max: 5,
        score: 2,
      });

      expect(dto.min).toEqual(0);
      expect(dto.optimal).toEqual(0);
      expect(dto.score).toEqual(2);

      const result = await validate(dto);
      expect(result.length).toEqual(0);
    });

    it('validate UpdateHabitModel with empty title', async () => {
      const dto = new UpdateHabitModel({
        title: '',
        text: 'This is my test activity',
        interval: CalendarIntervalEnum.Daily,
        max: 5,
        score: 5,
      });

      const result = await validate(dto);
      expect(result.length).toEqual(1);
      expect(result[0].property).toEqual('title');
    });

    it('validate UpdateHabitModel with negative units', async () => {
      const dto = new UpdateHabitModel({
        title: 'Test',
        text: 'This is my test activity',
        interval: CalendarIntervalEnum.Daily,
        max: -1,
        score: 5,
      });

      const result = await validate(dto);
      expect(result.length).toBeTruthy();
      expect(result[0].property).toEqual('max');
    });

    it('validate UpdateHabitModel with min > units', async () => {
      const dto = new UpdateHabitModel({
        title: 'Test',
        text: 'This is my test activity',
        interval: CalendarIntervalEnum.Daily,
        max: 5,
      });

      dto.min = 10;

      const result = await validate(dto);
      expect(result.length).toBeTruthy();
      expect(result[0].property).toEqual('min');
    });
  });

  describe('UpdateActivityDataPointDto', function () {
    it('validate valid dto', async () => {
      const dto = new UpdateHabitDataPointModel({
        date: '2021-01-01',
        value: 5,
      });

      const result = await validate(dto);
      expect(result.length).toEqual(0);
    });

    it('validate invalid date', async () => {
      const dto = new UpdateHabitDataPointModel({
        date: '01-01-2021',
        value: 5,
      });

      const result = await validate(dto);
      expect(result.length).toEqual(1);
      expect(result[0].property).toEqual('date');
    });
  });
});
