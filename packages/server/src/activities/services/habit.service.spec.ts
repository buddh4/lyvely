import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { HabitsService } from './habits.service';
import {
  ActivityType,
  CalendarIntervalEnum,
  CreateHabitModel,
  DataPointInputType,
  PropertiesOf,
  UpdateHabitModel,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { Profile } from '@/profiles';
import { ActivityTestDataUtil, createActivityTestingModule } from '../test/activities.test.utils';
import { HabitsDao } from '../daos/habits.dao';
import { User } from '@/users';

describe('HabitService', () => {
  let habitService: HabitsService;
  let testingModule: TestingModule;
  let testData: ActivityTestDataUtil;

  const TEST_KEY = 'habit_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [
      HabitsDao,
      HabitsService,
    ]).compile();
    habitService = testingModule.get<HabitsService>(HabitsService);
    testData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  const createHabit = async (
    user: User,
    profile: Profile,
    dto?: PropertiesOf<CreateHabitModel>,
  ) => {
    dto = dto || {
      min: 0,
      max: 1,
      title: 'Do something!',
      score: 5,
      tagNames: [],
      userStrategy: UserAssignmentStrategy.Shared,
      inputType: DataPointInputType.Checkbox,
      interval: CalendarIntervalEnum.Daily,
    };

    return habitService.createContent(profile, user, dto);
  };

  describe('create Habit', () => {
    it('create', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await createHabit(user, profile);

      expect(habit.type).toBe(ActivityType.Habit);
      expect(habit.meta.sortOrder).toEqual(0);
      expect(habit.meta.createdAt).toBeDefined();
      expect(habit.meta.updatedAt).toBeDefined();
      expect(habit.timeSeriesConfig.min).toEqual(0);
      expect(habit.timeSeriesConfig.max).toEqual(1);
      expect(habit.config.score).toEqual(5);
      expect(habit.content.title).toEqual('Do something!');
      expect(habit.tagIds.length).toEqual(0);
    });

    it('sortOrder creation', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit1 = await createHabit(user, profile);
      const habit2 = await createHabit(user, profile);

      expect(habit1.meta.sortOrder).toEqual(0);
      expect(habit2.meta.sortOrder).toEqual(1);
    });
  });

  describe('applyUpdate', () => {
    it('find activity by object id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile);

      habit.applyUpdate(
        new UpdateHabitModel({
          title: 'Updated Title',
          text: 'Updated description',
          interval: CalendarIntervalEnum.Weekly,
          max: 2,
          score: 2,
          min: 1,
          optimal: 2,
        }),
      );

      await habitService.updateContentSet(profile, user, habit, habit, {
        tagNames: ['SomeCategory'],
      });

      const search = await habitService.findByProfileAndId(profile, habit._id);
      expect(search).toBeDefined();
      expect(search.content.title).toEqual('Updated Title');
      expect(search.content.text).toEqual('Updated description');
      expect(search.timeSeriesConfig.interval).toEqual(CalendarIntervalEnum.Weekly);
      expect(search.timeSeriesConfig.min).toEqual(1);
      expect(search.timeSeriesConfig.max).toEqual(2);
      expect(search.timeSeriesConfig.optimal).toEqual(2);
      expect(search.tagIds.length).toEqual(1);
      expect(search.tagIds[0]).toEqual(profile.tags[0]._id);
      expect(profile.tags.length).toEqual(1);
      expect(profile.tags[0].name).toEqual('SomeCategory');
    });

    it('assure checkbox constraint', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(
        user,
        profile,
        new CreateHabitModel({
          title: 'Test',
          interval: CalendarIntervalEnum.Daily,
          inputType: DataPointInputType.Checkbox,
          max: 2,
          min: 1,
          optimal: 1,
          score: 2,
        }),
      );

      habit.applyUpdate(
        new UpdateHabitModel({
          title: 'Test',
          interval: CalendarIntervalEnum.Weekly,
          inputType: DataPointInputType.Checkbox,
          max: 16,
          min: 1,
          optimal: 2,
          score: 2,
        }),
      );

      expect(habit.config.timeSeries.max).toEqual(8);
    });

    it('update data point config creates revision', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(
        user,
        profile,
        new CreateHabitModel({
          title: 'Test',
          interval: CalendarIntervalEnum.Daily,
          max: 2,
          min: 1,
          optimal: 1,
          score: 2,
        }),
      );

      habit.applyUpdate(
        new UpdateHabitModel({
          title: 'Test',
          interval: CalendarIntervalEnum.Weekly,
          max: 3,
          min: 1,
          optimal: 2,
          score: 2,
        }),
      );

      await habitService.updateContentSet(profile, user, habit, habit);

      const search = await habitService.findByProfileAndId(profile, habit._id);
      expect(search).toBeDefined();
      expect(search.timeSeriesConfig.history).toBeDefined();
      expect(search.timeSeriesConfig.history.length).toEqual(1);
      expect(search.timeSeriesConfig.history[0].max).toEqual(2);
      expect(search.timeSeriesConfig.history[0].min).toEqual(1);
      expect(search.timeSeriesConfig.history[0].optimal).toEqual(1);
      expect(search.timeSeriesConfig.history[0].interval).toEqual(CalendarIntervalEnum.Daily);
    });
  });

  it('daily revision is not overwritten on same day', async () => {
    const { user, profile } = await testData.createUserAndProfile();
    const habit = await testData.createHabit(
      user,
      profile,
      new CreateHabitModel({
        title: 'Test',
        interval: CalendarIntervalEnum.Daily,
        max: 2,
        min: 1,
        optimal: 1,
        score: 2,
      }),
    );

    habit.applyUpdate(
      new UpdateHabitModel({
        title: 'Test',
        interval: CalendarIntervalEnum.Weekly,
        max: 3,
        min: 1,
        optimal: 2,
        score: 2,
      }),
    );

    await habitService.updateContentSet(profile, user, habit, habit);

    habit.applyUpdate(
      new UpdateHabitModel({
        title: 'Test',
        interval: CalendarIntervalEnum.Weekly,
        max: 4,
        min: 1,
        optimal: 2,
        score: 2,
      }),
    );

    await habitService.updateContentSet(profile, user, habit, habit);

    const search = await habitService.findByProfileAndId(profile, habit);
    expect(search).toBeDefined();
    expect(search.timeSeriesConfig.history).toBeDefined();
    expect(search.timeSeriesConfig.history.length).toEqual(1);
    expect(search.timeSeriesConfig.history[0].max).toEqual(2);
    expect(search.timeSeriesConfig.max).toEqual(4);
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
