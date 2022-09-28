import { UpdateHabitDto } from '@/activities';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

describe('UpdateHabitDto', () => {
  describe('transform', function () {
    it('filter by habit type success', async () => {
      plainToClass(UpdateHabitDto, {
        optimal: 3,
        max: 3,
        min: 3,
        score: 3,
        interval: 0,
        strategy: 'checkbox_number',
        userStrategy: 0,
        categories: ['asdf'],
        title: 'hess',
        plan: 3,
        text: 'asdfasdf',
      });
    });
  });

  describe('validate', function () {
    it('test', async () => {
      const model = plainToClass(UpdateHabitDto, { title: 'test' });
      const validation = await validate(model);
      expect(validation.length).toEqual(0);
    });
  });
});
