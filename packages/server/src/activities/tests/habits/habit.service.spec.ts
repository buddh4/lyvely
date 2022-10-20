import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { HabitsService } from '../../services/habits.service';
import { Habit } from '../../schemas';
import { CalendarIntervalEnum, ActivityType, CreateHabitDto, UpdateHabitDto } from '@lyvely/common';
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
    testingModule = await createActivityTestingModule(TEST_KEY, [HabitsDao, HabitsService]).compile();
    habitService = testingModule.get<HabitsService>(HabitsService);
    testData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  const createHabit = async (user: User, profile: Profile, dto?: CreateHabitDto) => {
    dto = dto || {
      max: 1,
      title: 'Do something!',
      score: 5,
      tagNames: [],
      interval: CalendarIntervalEnum.Daily,
    };

    return habitService.createContent(profile, user, Habit.create(profile, user, dto));
  };

  describe('create Habit', () => {
    it('create', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await createHabit(user, profile);

      expect(habit.type).toBe(ActivityType.Habit);
      expect(habit.sortOrder).toEqual(0);
      expect(habit.createdAt).toBeDefined();
      expect(habit.updatedAt).toBeDefined();
      expect(habit.dataPointConfig.min).toEqual(0);
      expect(habit.dataPointConfig.max).toEqual(1);
      expect(habit.score).toEqual(5);
      expect(habit.title).toEqual('Do something!');
      expect(habit.tagIds.length).toEqual(0);
    });

    it('sortOrder creation', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit1 = await createHabit(user, profile);
      const habit2 = await createHabit(user, profile);

      expect(habit1.sortOrder).toEqual(0);
      expect(habit2.sortOrder).toEqual(1);
    });

    it('create duplicate', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      await testData.createHabit(user, profile);

      try {
        await testData.createHabit(user, profile);
        expect(true).toBeFalsy();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('updateHabit', () => {
    it('find activity by object id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile);

      await habitService.updateHabit(
        profile,
        user,
        habit,
        new UpdateHabitDto({
          title: 'Test',
          text: 'Test description',
          interval: CalendarIntervalEnum.Weekly,
          max: 2,
          score: 2,
          min: 1,
          optimal: 2,
          tagNames: ['SomeCategory'],
        }),
      );

      const search = await habitService.findByProfileAndId(profile, habit._id);
      expect(search).toBeDefined();
      expect(search.title).toEqual('Test');
      expect(search.text).toEqual('Test description');
      expect(search.dataPointConfig.interval).toEqual(CalendarIntervalEnum.Weekly);
      expect(search.dataPointConfig.min).toEqual(1);
      expect(search.dataPointConfig.max).toEqual(2);
      expect(search.dataPointConfig.optimal).toEqual(2);
      expect(search.tagIds.length).toEqual(1);
      expect(search.tagIds[0]).toEqual(profile.tags[0]._id);
      expect(profile.tags.length).toEqual(1);
      expect(profile.tags[0].name).toEqual('SomeCategory');
    });

    it('update data point config creates revision', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(
        user,
        profile,
        new CreateHabitDto({
          title: 'Test',
          interval: CalendarIntervalEnum.Daily,
          max: 2,
          min: 1,
          optimal: 1,
          score: 2,
        }),
      );

      await habitService.updateHabit(
        profile,
        user,
        habit,
        new UpdateHabitDto({
          title: 'Test',
          interval: CalendarIntervalEnum.Weekly,
          max: 3,
          min: 1,
          optimal: 2,
          score: 2,
        }),
      );

      const search = await habitService.findByProfileAndId(profile, habit._id);
      expect(search).toBeDefined();
      expect(search.dataPointConfig.history).toBeDefined();
      expect(search.dataPointConfig.history.length).toEqual(1);
      expect(search.dataPointConfig.history[0].max).toEqual(2);
      expect(search.dataPointConfig.history[0].min).toEqual(1);
      expect(search.dataPointConfig.history[0].optimal).toEqual(1);
      expect(search.dataPointConfig.history[0].interval).toEqual(CalendarIntervalEnum.Daily);
    });
  });

  it('daily revision is not overwritten on same day', async () => {
    const { user, profile } = await testData.createUserAndProfile();
    const habit = await testData.createHabit(
      user,
      profile,
      new CreateHabitDto({
        title: 'Test',
        interval: CalendarIntervalEnum.Daily,
        max: 2,
        min: 1,
        optimal: 1,
        score: 2,
      }),
    );

    await habitService.updateHabit(
      profile,
      user,
      habit,
      new UpdateHabitDto({
        title: 'Test',
        interval: CalendarIntervalEnum.Weekly,
        max: 3,
        min: 1,
        optimal: 2,
        score: 2,
      }),
    );

    await habitService.updateHabit(
      profile,
      user,
      habit,
      new UpdateHabitDto({
        title: 'Test',
        interval: CalendarIntervalEnum.Weekly,
        max: 4,
        min: 1,
        optimal: 2,
        score: 2,
      }),
    );

    const search = await habitService.findByProfileAndId(profile, habit);
    expect(search).toBeDefined();
    expect(search.dataPointConfig.history).toBeDefined();
    expect(search.dataPointConfig.history.length).toEqual(1);
    expect(search.dataPointConfig.history[0].max).toEqual(2);
    expect(search.dataPointConfig.max).toEqual(4);
  });

  describe('findUserActivityById', () => {
    it('find activity by object id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const activity = await testData.createHabit(user, profile);
      const search = await habitService.findByProfileAndId(profile, activity._id);
      expect(search._id).toEqual(activity._id);
    });

    it('find activity by string id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const activity = await testData.createHabit(user, profile);
      const search = await habitService.findByProfileAndId(profile, activity._id.toString());
      expect(search._id).toEqual(activity._id);
    });
  });
});
