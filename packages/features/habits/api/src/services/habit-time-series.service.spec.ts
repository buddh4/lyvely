import { sortBySortOrder } from '@lyvely/common';
import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import { CalendarInterval } from '@lyvely/dates';
import { Profile } from '@lyvely/profiles';
import { HabitTestDataUtil, habitTestPlugin } from '../testing';
import { HabitDataPointDao, HabitsDao } from '../daos';
import { User } from '@lyvely/users';
import { HabitDataPointService } from './habit-data-point.service';
import { HabitsService } from './habits.service';
import { Habit } from '../schemas';
import { HabitTimeSeriesService } from './habit-time-series.service';
import { buildTest, LyvelyTestingModule } from '@lyvely/testing';

describe('HabitTimeSeriesService', () => {
  let habitsTimeSeriesService: HabitTimeSeriesService;
  let testingModule: LyvelyTestingModule;
  let testData: HabitTestDataUtil;

  const TEST_KEY = 'habit_time_series_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([habitTestPlugin])
      .providers([
        HabitsDao,
        HabitDataPointDao,
        HabitTimeSeriesService,
        HabitDataPointService,
        HabitsService,
      ])
      .compile();
    habitsTimeSeriesService = testingModule.get(HabitTimeSeriesService);
    testData = testingModule.get(HabitTestDataUtil);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('findByFilter', () => {
    it('find habit', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const habit = await testData.createHabit(user, profile);
      const filter = new CalendarPlanFilter('2021-01-01');
      const { models: habits } = await habitsTimeSeriesService.findTimeSeries(
        profile,
        user,
        filter,
      );
      expect(habits.length).toEqual(1);
      expect(habits[0].id).toEqual(habit.id);
    });

    it('find habit log within filter range', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const habit = await testData.createHabit(user, profile);
      const log = await testData.createDataPoint(user, profile, habit, new Date());
      const filter = new CalendarPlanFilter(new Date());
      const { dataPoints } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
      expect(dataPoints.length).toEqual(1);
      expect(dataPoints[0].id).toEqual(log.id);
    });

    it('do not find habit log outside of filter range', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const habit = await testData.createHabit(user, profile);
      await testData.createDataPoint(user, profile, habit, HabitTestDataUtil.getDateTomorrow());
      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateYesterday());
      const { dataPoints } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
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
          { title: 'h0', interval: CalendarInterval.Daily },
          (model) => {
            model.meta.sortOrder = 0;
          },
        ),
        await testData.createHabit(
          user,
          profile,
          { title: 'h1', interval: CalendarInterval.Daily },
          (model) => {
            model.meta.sortOrder = 1;
          },
        ),
        await testData.createHabit(
          user,
          profile,
          { title: 'h2', interval: CalendarInterval.Weekly },
          (model) => {
            model.meta.sortOrder = 0;
          },
        ),
        await testData.createHabit(
          user,
          profile,
          { title: 'h3', interval: CalendarInterval.Weekly },
          (model) => {
            model.meta.sortOrder = 1;
          },
        ),
        await testData.createHabit(
          user,
          profile,
          { title: 'h4', interval: CalendarInterval.Weekly },
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

      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
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

      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
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

      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
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

      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
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

      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateTomorrow());
      const { models } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
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

      expect(habits[0].timeSeriesConfig.interval).toEqual(CalendarInterval.Weekly);
      expect(habits[0].timeSeriesConfig.history.length).toEqual(1);
      expect(habits[0].timeSeriesConfig.history[0].interval).toEqual(CalendarInterval.Daily);

      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateTomorrow());
      let { models } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
      models = models.filter(
        (model) => model.timeSeriesConfig.interval === CalendarInterval.Weekly,
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

      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateTomorrow());
      let { models } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
      models = models.filter(
        (model) => model.timeSeriesConfig.interval === CalendarInterval.Weekly,
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

      const filter = new CalendarPlanFilter(HabitTestDataUtil.getDateTomorrow());
      let { models } = await habitsTimeSeriesService.findTimeSeries(profile, user, filter);
      models = models.filter(
        (model) => model.timeSeriesConfig.interval === CalendarInterval.Weekly,
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
