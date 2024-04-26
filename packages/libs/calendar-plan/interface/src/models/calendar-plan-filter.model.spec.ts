import { CalendarPlanFilter } from '../index';
import { plainToClass } from 'class-transformer';

describe('CalendarPlanFilter', () => {
  describe('Transform', function () {
    it('transform query should work', () => {
      const result = plainToClass(CalendarPlanFilter, { date: '2024-04-26', level: '0' });
      expect(result instanceof CalendarPlanFilter).toEqual(true);
      expect(typeof result.level).toEqual('number');
      expect(result.level).toEqual(0);
    });
  });
});
