import {EditHabitDto, UpdateActivityLogModel, CalendarIntervalEnum } from '../../index';
import { validate } from "class-validator";

describe('Activity Model', () => {

  describe('EditHabitDto', function () {
    it('validate valid dto', async () => {
      let dto = new EditHabitDto({
        title: 'Test activity',
        text: 'This is my test activity',
        interval: CalendarIntervalEnum.Daily,
        max: 5,
      });

      expect(dto.min).toEqual(0);
      expect(dto.optimal).toEqual(0);
      expect(dto.score).toEqual(2);

      let result = await validate(dto);
      expect(result.length).toEqual(0);
    });

    it('validate EditHabitDto with empty title', async () => {
      let dto = new EditHabitDto({
        title: '',
        text: 'This is my test activity',
        interval: CalendarIntervalEnum.Daily,
        max: 5,
        score: 5,
      });

      let result = await validate(dto);
      expect(result.length).toEqual(1);
      expect(result[0].property).toEqual('title');
    });

    it('validate EditHabitDto with negative units', async () => {
      let dto = new EditHabitDto({
        title: 'Test',
        text: 'This is my test activity',
        interval: CalendarIntervalEnum.Daily,
        max: -1,
        score: 5,
      });

      let result = await validate(dto);
      expect(result.length).toBeTruthy();
      expect(result[0].property).toEqual('max');
    });

    it('validate EditHabitDto with min > units', async () => {
      let dto = new EditHabitDto({
        title: 'Test',
        text: 'This is my test activity',
        interval: CalendarIntervalEnum.Daily,
        max: 5
      });

      dto.min = 10;

      let result = await validate(dto);
      expect(result.length).toBeTruthy();
      expect(result[0].property).toEqual('min');
    });
  });

  describe('UpdateActivityLogDto', function () {
    it('validate valid dto', async () => {
      let dto = new UpdateActivityLogModel({
        date: '2021-01-01',
        value: 5
      });

      let result = await validate(dto);
      expect(result.length).toEqual(0);
    });

    it('validate invalid date', async () => {
      let dto = new UpdateActivityLogModel({
        date: '01-01-2021',
        value: 5
      });

      let result = await validate(dto);
      expect(result.length).toEqual(1);
      expect(result[0].property).toEqual('date');
    });
  });
});