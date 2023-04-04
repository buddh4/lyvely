import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { CalendarIntervalEnum, DataPointIntervalFilter, sortBySortOrder } from '@lyvely/common';
import { Profile } from '@/profiles';
import { createHabitTestingModule, HabitTestDataUtil } from '../test';
import { HabitDataPointDao, HabitsDao } from '../daos';
import { User } from '@/users';
import { HabitDataPointService } from './habit-data-point.service';
import { HabitsService } from './habits.service';
import { Habit } from '../schemas';
import { HabitTimeSeriesService } from './habit-time-series.service';

describe('HabitTimeSeriesService', () => {
  let habitsTimeSeriesService: HabitTimeSeriesService;
  let habitsService: HabitsService;
  let testingModule: TestingModule;
  let testData: HabitTestDataUtil;

  const TEST_KEY = 'habit_time_series_service';

  beforeEach(async () => {
    testingModule = await createHabitTestingModule(TEST_KEY, [
      HabitsDao,
      HabitDataPointDao,
      HabitTimeSeriesService,
      HabitDataPointService,
      HabitsService,
    ]).compile();
    habitsTimeSeriesService = testingModule.get(HabitTimeSeriesService);
    habitsService = testingModule.get(HabitsService);
    testData = testingModule.get(HabitTestDataUtil);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  describe('findByFilter', () => {
    it('find habit', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const habit = await testData.createHabit(user, profile);
      const filter = new DataPointIntervalFilter('2021-01-01');
      const { models: habits } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      expect(habits.length).toEqual(1);
      expect(habits[0].id).toEqual(habit.id);
    });

    it('find habit log within filter range', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const habit = await testData.createHabit(user, profile);
      const log = await testData.createDataPoint(user, profile, habit, new Date());
      const filter = new DataPointIntervalFilter(new Date());
      const { dataPoints } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      expect(dataPoints.length).toEqual(1);
      expect(dataPoints[0].id).toEqual(log.id);
    });

    it('do not find habit log outside of filter range', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const habit = await testData.createHabit(user, profile);
      await testData.createDataPoint(user, profile, habit, HabitTestDataUtil.getDateTomorrow());
      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateYesterday());
      const { dataPoints } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      expect(dataPoints.length).toEqual(0);
    });
  });

  describe('sort', () => {
    const createHabits = async (user: User, profile: Profile) => {
      return [
        await testData.createHabit(user, profile, { title: 'h0' }, (model) => {
          model.meta.sortOrder = 0;
        }),
        await testData.createHabit(user, profile, { title: 'h1' }, (model) => {
          model.meta.sortOrder = 1;
        }),
        await testData.createHabit(user, profile, { title: 'h2' }, (model) => {
          model.meta.sortOrder = 2;
        }),
        await testData.createHabit(user, profile, { title: 'h3' }, (model) => {
          model.meta.sortOrder = 3;
        }),
        await testData.createHabit(user, profile, { title: 'h4' }, (model) => {
          model.meta.sortOrder = 4;
        }),
      ];
    };

    const createMultiIntervalHabits = async (user: User, profile: Profile) => {
      return [
        await testData.createHabit(
          user,
          profile,
          { title: 'h0', interval: CalendarIntervalEnum.Daily },
          (model) => {
            model.meta.sortOrder = 0;
          },
        ),
        await testData.createHabit(
          user,
          profile,
          { title: 'h1', interval: CalendarIntervalEnum.Daily },
          (model) => {
            model.meta.sortOrder = 1;
          },
        ),
        await testData.createHabit(
          user,
          profile,
          { title: 'h2', interval: CalendarIntervalEnum.Weekly },
          (model) => {
            model.meta.sortOrder = 0;
          },
        ),
        await testData.createHabit(
          user,
          profile,
          { title: 'h3', interval: CalendarIntervalEnum.Weekly },
          (model) => {
            model.meta.sortOrder = 1;
          },
        ),
        await testData.createHabit(
          user,
          profile,
          { title: 'h4', interval: CalendarIntervalEnum.Weekly },
          (model) => {
            model.meta.sortOrder = 2;
          },
        ),
      ];
    };

    it('sort between', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const habits = await createHabits(user, profile);

      await habitsTimeSeriesService.sort(
        profile,
        user,
        habits[1],
        habits[1].timeSeriesConfig.interval,
        habits[3],
      );

      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      sortHabits(models);
      expect(models.length).toEqual(5);
      expect(models[0].content.title).toEqual('h0');
      expect(models[1].content.title).toEqual('h2');
      expect(models[2].content.title).toEqual('h3');
      expect(models[3].content.title).toEqual('h1');
      expect(models[4].content.title).toEqual('h4');
    });

    it('sort first entry to second entry', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const habits = await createHabits(user, profile);

      await habitsTimeSeriesService.sort(
        profile,
        user,
        habits[0],
        habits[0].timeSeriesConfig.interval,
        habits[1],
      );

      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      sortHabits(models);
      expect(models.length).toEqual(5);
      expect(models[0].content.title).toEqual('h1');
      expect(models[1].content.title).toEqual('h0');
      expect(models[2].content.title).toEqual('h2');
      expect(models[3].content.title).toEqual('h3');
      expect(models[4].content.title).toEqual('h4');
    });

    it('sort to top', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const habits = await createHabits(user, profile);

      await habitsTimeSeriesService.sort(
        profile,
        user,
        habits[3],
        habits[3].timeSeriesConfig.interval,
      );

      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      sortHabits(models);
      expect(models.length).toEqual(5);
      expect(models[0].content.title).toEqual('h3');
      expect(models[1].content.title).toEqual('h0');
      expect(models[2].content.title).toEqual('h1');
      expect(models[3].content.title).toEqual('h2');
      expect(models[4].content.title).toEqual('h4');
    });

    it('sort to bottom', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habits = await createHabits(user, profile);

      await habitsTimeSeriesService.sort(
        profile,
        user,
        habits[1],
        habits[1].timeSeriesConfig.interval,
        habits[4],
      );

      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      sortHabits(models);
      expect(models.length).toEqual(5);
      expect(models[0].content.title).toEqual('h0');
      expect(models[1].content.title).toEqual('h2');
      expect(models[2].content.title).toEqual('h3');
      expect(models[3].content.title).toEqual('h4');
      expect(models[4].content.title).toEqual('h1');
    });

    it('sort to same index', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habits = await createHabits(user, profile);

      await habitsTimeSeriesService.sort(
        profile,
        user,
        habits[2],
        habits[2].timeSeriesConfig.interval,
        habits[2],
      );

      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      sortHabits(models);
      expect(models.length).toEqual(5);
      expect(models[0].content.title).toEqual('h0');
      expect(models[1].content.title).toEqual('h1');
      expect(models[2].content.title).toEqual('h2');
      expect(models[3].content.title).toEqual('h3');
      expect(models[4].content.title).toEqual('h4');
    });

    it('sort between another interval', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habits = await createMultiIntervalHabits(user, profile);

      await habitsTimeSeriesService.sort(
        profile,
        user,
        habits[0],
        habits[2].timeSeriesConfig.interval,
        habits[2],
      );

      expect(habits[0].timeSeriesConfig.interval).toEqual(CalendarIntervalEnum.Weekly);
      expect(habits[0].timeSeriesConfig.history.length).toEqual(1);
      expect(habits[0].timeSeriesConfig.history[0].interval).toEqual(CalendarIntervalEnum.Daily);

      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateTomorrow());
      let { models } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      models = models.filter(
        (model) => model.timeSeriesConfig.interval === CalendarIntervalEnum.Weekly,
      );

      sortHabits(models);

      expect(models.length).toEqual(4);
      expect(models[0].content.title).toEqual('h2');
      expect(models[1].content.title).toEqual('h0');
      expect(models[2].content.title).toEqual('h3');
      expect(models[3].content.title).toEqual('h4');
    });

    it('sort on top of another interval', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habits = await createMultiIntervalHabits(user, profile);

      await habitsTimeSeriesService.sort(
        profile,
        user,
        habits[0],
        habits[2].timeSeriesConfig.interval,
      );

      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateTomorrow());
      let { models } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      models = models.filter(
        (model) => model.timeSeriesConfig.interval === CalendarIntervalEnum.Weekly,
      );

      sortHabits(models);

      expect(models.length).toEqual(4);
      expect(models[0].content.title).toEqual('h0');
      expect(models[1].content.title).toEqual('h2');
      expect(models[2].content.title).toEqual('h3');
      expect(models[3].content.title).toEqual('h4');
    });

    it('sort to end of another interval', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habits = await createMultiIntervalHabits(user, profile);

      await habitsTimeSeriesService.sort(
        profile,
        user,
        habits[0],
        habits[4].timeSeriesConfig.interval,
        habits[4],
      );

      const filter = new DataPointIntervalFilter(HabitTestDataUtil.getDateTomorrow());
      let { models } = await habitsTimeSeriesService.findByFilter(profile, user, filter);
      models = models.filter(
        (model) => model.timeSeriesConfig.interval === CalendarIntervalEnum.Weekly,
      );

      sortHabits(models);

      expect(models.length).toEqual(4);
      expect(models[0].content.title).toEqual('h2');
      expect(models[1].content.title).toEqual('h3');
      expect(models[2].content.title).toEqual('h4');
      expect(models[3].content.title).toEqual('h0');
    });
  });

  function sortHabits(habits: Habit[]) {
    habits.sort(sortBySortOrder);
  }
});
