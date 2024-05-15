import { HabitsService } from './habits.service';
import { PropertiesOf } from '@lyvely/common';
import {
  UserAssignmentStrategy,
  assureStringId,
  ProtectedProfileContext,
  buildProfileTest,
} from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { DataPointValueType, DataPointInputType } from '@lyvely/time-series';
import { UpdateHabitModel, CreateHabitModel } from '@lyvely/habits-interface';
import { HabitTestDataUtil, habitTestPlugin } from '../testing';
import { HabitsDao } from '../daos';
import { Habit } from '../schemas';
import { LyvelyTestingModule } from '@lyvely/testing';

describe('HabitService', () => {
  let habitsService: HabitsService;
  let testingModule: LyvelyTestingModule;
  let testData: HabitTestDataUtil;

  const TEST_KEY = 'habit_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY)
      .plugins([habitTestPlugin])
      .providers([HabitsDao, HabitsService])
      .compile();
    habitsService = testingModule.get<HabitsService>(HabitsService);
    testData = testingModule.get(HabitTestDataUtil);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  const createHabit = async (
    context: ProtectedProfileContext,
    raw?: PropertiesOf<CreateHabitModel>,
  ) => {
    raw = raw || {
      min: 0,
      max: 1,
      title: 'Do something!',
      score: 5,
      tagNames: [],
      valueType: DataPointValueType.Number,
      userStrategy: UserAssignmentStrategy.Shared,
      inputType: DataPointInputType.Checkbox,
      interval: CalendarInterval.Daily,
    };

    return habitsService.createContent(context, new CreateHabitModel(raw));
  };

  describe('create Habit', () => {
    it('create', async () => {
      const { context } = await testData.createUserAndProfile();
      const habit = await createHabit(context);

      expect(habit.type).toBe(Habit.name);
      expect(habit.meta.createdAt).toBeDefined();
      expect(habit.meta.updatedAt).toBeDefined();
      expect(habit.timeSeriesConfig.min).toEqual(0);
      expect(habit.timeSeriesConfig.max).toEqual(1);
      expect(habit.config.score).toEqual(5);
      expect(habit.content.title).toEqual('Do something!');
      expect(habit.tagIds.length).toEqual(0);
    });
  });

  describe('applyUpdate', () => {
    it('find habit by object id', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile);

      habit.applyUpdate(
        new UpdateHabitModel({
          title: 'Updated Title',
          text: 'Updated description',
          interval: CalendarInterval.Weekly,
          max: 2,
          score: 2,
          min: 1,
          optimal: 2,
        }),
      );

      await habitsService.updateContentSet(context, habit, habit, {
        tagNames: ['SomeCategory'],
      });

      const search = await habitsService.findByProfileAndId(profile, habit._id);
      expect(search).toBeDefined();
      expect(search!.content.title).toEqual('Updated Title');
      expect(search!.content.text).toEqual('Updated description');
      expect(search!.timeSeriesConfig.interval).toEqual(CalendarInterval.Weekly);
      expect(search!.timeSeriesConfig.min).toEqual(1);
      expect(search!.timeSeriesConfig.max).toEqual(2);
      expect(search!.timeSeriesConfig.optimal).toEqual(2);
      expect(search!.tagIds.length).toEqual(1);
      expect(search!.tagIds[0]).toEqual(profile.tags[0]._id);
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
          interval: CalendarInterval.Daily,
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
          interval: CalendarInterval.Weekly,
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
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(
        user,
        profile,
        new CreateHabitModel({
          title: 'Test',
          interval: CalendarInterval.Daily,
          max: 2,
          min: 1,
          optimal: 1,
          score: 2,
        }),
      );

      habit.applyUpdate(
        new UpdateHabitModel({
          title: 'Test',
          interval: CalendarInterval.Weekly,
          max: 3,
          min: 1,
          optimal: 2,
          score: 2,
        }),
      );

      await habitsService.updateContentSet(context, habit, habit);

      const search = await habitsService.findByProfileAndId(profile, habit._id);
      expect(search).toBeDefined();
      expect(search!.timeSeriesConfig.history).toBeDefined();
      expect(search!.timeSeriesConfig.history.length).toEqual(1);
      expect(search!.timeSeriesConfig.history[0].max).toEqual(2);
      expect(search!.timeSeriesConfig.history[0].min).toEqual(1);
      expect(search!.timeSeriesConfig.history[0].optimal).toEqual(1);
      expect(search!.timeSeriesConfig.history[0].interval).toEqual(CalendarInterval.Daily);
    });
  });

  it('daily revision is not overwritten on same day', async () => {
    const { user, profile, context } = await testData.createUserAndProfile();
    const habit = await testData.createHabit(
      user,
      profile,
      new CreateHabitModel({
        title: 'Test',
        interval: CalendarInterval.Daily,
        max: 2,
        min: 1,
        optimal: 1,
        score: 2,
      }),
    );

    habit.applyUpdate(
      new UpdateHabitModel({
        title: 'Test',
        interval: CalendarInterval.Weekly,
        max: 3,
        min: 1,
        optimal: 2,
        score: 2,
      }),
    );

    await habitsService.updateContentSet(context, habit, habit);

    habit.applyUpdate(
      new UpdateHabitModel({
        title: 'Test',
        interval: CalendarInterval.Weekly,
        max: 4,
        min: 1,
        optimal: 2,
        score: 2,
      }),
    );

    await habitsService.updateContentSet(context, habit, habit);

    const search = await habitsService.findByProfileAndId(profile, habit);
    expect(search).toBeDefined();
    expect(search!.timeSeriesConfig.history).toBeDefined();
    expect(search!.timeSeriesConfig.history.length).toEqual(1);
    expect(search!.timeSeriesConfig.history[0].max).toEqual(2);
    expect(search!.timeSeriesConfig.max).toEqual(4);
  });

  describe('findByProfileAndId', () => {
    it('find habit by profile and ObjectId', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const habit = await testData.createHabit(user, profile);
      const search = await habitsService.findByProfileAndId(profile, habit._id);
      expect(search).toBeDefined();
      expect(search!.id).toEqual(habit.id);
    });

    it('find habit by profile and string id', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const habit = await testData.createHabit(user, profile);
      const search = await habitsService.findByProfileAndId(profile, assureStringId(habit._id));
      expect(search).toBeDefined();
      expect(search!.id).toEqual(habit.id);
    });

    it('do not find habits of another profile', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const profile2 = await testData.createProfile(user, 'profile2');
      const habit = await testData.createHabit(user, profile);
      const search = await habitsService.findByProfileAndId(profile2, assureStringId(habit._id));
      expect(search).toBeNull();
    });

    it('find habit by object id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile);
      const search = await habitsService.findByProfileAndId(profile, habit._id);
      expect(search!._id).toEqual(habit._id);
    });

    it('find habit by string id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile);
      const search = await habitsService.findByProfileAndId(profile, habit._id.toString());
      expect(search!._id).toEqual(habit._id);
    });
  });
});
