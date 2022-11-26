import { UpdateHabitDto, UpdateDataPointDto } from '@/activities';
import { CalendarIntervalEnum } from '@/calendar';
import { validate } from 'class-validator';

describe('Activity Model', () => {
  describe('UpdateHabitDto', function () {
    it('validate valid dto', async () => {
      const dto = new UpdateHabitDto({
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

    it('validate UpdateHabitDto with empty title', async () => {
      const dto = new UpdateHabitDto({
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

    it('validate UpdateHabitDto with negative units', async () => {
      const dto = new UpdateHabitDto({
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

    it('validate UpdateHabitDto with min > units', async () => {
      const dto = new UpdateHabitDto({
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
      const dto = new UpdateDataPointDto({
        date: '2021-01-01',
        value: 5,
      });

      const result = await validate(dto);
      expect(result.length).toEqual(0);
    });

    it('validate invalid date', async () => {
      const dto = new UpdateDataPointDto({
        date: '01-01-2021',
        value: 5,
      });

      const result = await validate(dto);
      expect(result.length).toEqual(1);
      expect(result[0].property).toEqual('date');
    });
  });
});
