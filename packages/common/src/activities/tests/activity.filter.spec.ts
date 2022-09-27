import { ActivityFilter, ActivityType, HabitModel, TaskModel } from '@/activities';

describe('Activity Filter', () => {

  describe('run', function () {
    it('filter by habit type success', async () => {
      const filter = new ActivityFilter({ type: ActivityType.Habit });
      const result = filter.check(new HabitModel());
      expect(result).toEqual(true);
    });

    it('filter by habit type fails', async () => {
      const filter = new ActivityFilter({ type: ActivityType.Habit });
      const result = filter.check(new TaskModel());
      expect(result).toEqual(false);
    });
  });
});
