import { EditHabitDto } from '../habit';

import { plainToClass } from 'class-transformer';

describe('EditHabitDto', () => {

  describe('transform', function () {
    it('filter by habit type success', async () => {
      const test = plainToClass(EditHabitDto, {
          optimal: 3,
          max: 3,
          min: 3,
          score: 3,
          interval: 0,
          strategy: 'checkbox_number',
          userStrategy: 0,
          categories: [ 'asdf' ],
          title: 'hess',
          plan: 3,
          text: 'asdfasdf'
        });
    });
  });
});
