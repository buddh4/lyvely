import { ActivityFilter, ActivityType, HabitDto, TaskDto } from '../../index';

describe('Activity Filter', () => {

  describe('run', function () {
    it('filter by habit type success', async () => {
      const filter = new ActivityFilter();
      filter.update({type: ActivityType.Habit});
      const result = filter.run(new HabitDto());
      expect(result).toEqual(true);
    });

    it('filter by habit type fails', async () => {
      const filter = new ActivityFilter();
      filter.update({type: ActivityType.Habit});
      const result = filter.run(new TaskDto());
      expect(result).toEqual(false);
    });
  });
});