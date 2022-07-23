import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { HabitsService } from '../../services/habits.service';
import { Habit } from '../../schemas';
import { CalendarIntervalEnum , ActivityType, CreateHabitDto, EditHabitDto } from 'lyvely-common';
import { Profile } from '../../../profiles';
import { ActivityTestDataUtil, createActivityTestingModule } from '../utils/activities.test.utils';
import { HabitsDao } from '../../daos/habits.dao';
import { User } from '../../../users';

describe('HabitService', () => {
  let habitService: HabitsService;
  let testingModule: TestingModule;
  let testData: ActivityTestDataUtil;

  const TEST_KEY = 'habit_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [HabitsDao, HabitsService] ).compile();
    habitService = testingModule.get<HabitsService>(HabitsService);
    testData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  const createHabit = async (user: User, profile: Profile, dto?: CreateHabitDto) => {
    dto = dto || {
      title: 'Do something!',
      score: 5,
      categories: [],
      interval: CalendarIntervalEnum.Daily,
    };

    return habitService.createContent(profile, user, Habit.create(user, profile, dto));
  };

  describe('create Habit', () => {
    it('create', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await createHabit(user, profile);

      expect(habit.type).toBe(ActivityType.Habit);
      expect(habit.createdAt).toBeDefined();
      expect(habit.updatedAt).toBeDefined();
      expect(habit.dataPointConfig.min).toEqual(0);
      expect(habit.dataPointConfig.max).toEqual(1);
      expect(habit.score).toEqual(5);
      expect(habit.title).toEqual('Do something!');
      expect(habit.categories.length).toEqual(0);
    });

    it('create duplicate', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      await testData.createHabit(user, profile);

      try {
        await testData.createHabit(user,profile);
        expect(true).toBeFalsy();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('create with categories', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await createHabit(user, profile, {
        title: 'test',
        score: 5,
        max: 5,
        categories: ['Category1', 'Category2'],
        interval: CalendarIntervalEnum.Daily,
      });

      expect(habit.categories.length).toEqual(2);
      expect(habit.categories[0]).toEqual('Category1');
      expect(habit.categories[1]).toEqual('Category2');
      expect(profile.categories.length).toEqual(2);
      expect(profile.categories[0].name).toEqual('Category1');
      expect(profile.categories[1].name).toEqual('Category2');
    });
  });

  describe('update Habit', () => {
    it('find activity by object id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user,profile);

      await habitService.updateContent(profile, user, habit, Habit.create(
          user,
          profile,
          new EditHabitDto({
            title: 'Test',
            text: 'Test description',
            interval: CalendarIntervalEnum.Weekly,
            max: 2,
            score: 2,
            min: 1,
            optimal: 2,
            categories: ['SomeCategory'],
          }),
        ),
      );

      const search = await habitService.findById(habit._id);
      expect(search).toBeDefined();
      expect(search.title).toEqual('Test');
      expect(search.text).toEqual('Test description');
      expect(search.interval).toEqual(CalendarIntervalEnum.Weekly);
      expect(search.dataPointConfig.min).toEqual(1);
      expect(search.dataPointConfig.max).toEqual(2);
      expect(search.dataPointConfig.optimal).toEqual(2);
      expect(search.categories.length).toEqual(1);
      expect(search.categories[0]).toEqual('SomeCategory');
      expect(profile.categories.length).toEqual(1);
      expect(profile.categories[0].name).toEqual('SomeCategory');
    });
  });

  describe('findUserActivityById', () => {
    it('find activity by object id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const activity = await testData.createHabit(user, profile);
      const search = await habitService.findById(activity._id);
      expect(search._id).toEqual(activity._id);
    });

    it('find activity by string id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const activity = await testData.createHabit(user, profile);
      const search = await habitService.findById(activity._id.toString());
      expect(search._id).toEqual(activity._id);
    });
  });
});
