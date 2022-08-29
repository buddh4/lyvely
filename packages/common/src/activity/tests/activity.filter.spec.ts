import { ActivityFilter, ActivityType, HabitDto, TaskDto } from '../../index';

describe('Activity Filter', () => {

  describe('run', function () {
    it('filter by habit type success', async () => {
      const filter = new ActivityFilter({ type: ActivityType.Habit });
      const result = filter.check(new HabitDto());
      expect(result).toEqual(true);
    });

    it('filter by habit type fails', async () => {
      const filter = new ActivityFilter({ type: ActivityType.Habit });
      const result = filter.check(new TaskDto());
      expect(result).toEqual(false);
    });
  });
});
