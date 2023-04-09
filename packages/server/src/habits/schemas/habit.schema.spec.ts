import { Profile } from '@/profiles';
import { User } from '@/users';
import { Habit } from './index';
import {
  CalendarInterval,
  CreatedAsType,
  CreateHabitModel,
  DataPointInputType,
  DataPointValueType,
  HabitModel,
  PropertiesOf,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { expect } from '@jest/globals';
import mongoose from 'mongoose';
import {
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  NumberDataPointConfig,
} from '@/time-series';
import { Tag } from '@/tags';
import { getObjectId, TestDataUtils } from '@/test';
import { instanceToPlain } from 'class-transformer';
import { TestingModule } from '@nestjs/testing';
import { HabitTestDataUtil, createHabitTestingModule } from '../test';
import { HabitsDao } from '../daos';

describe('Habit', () => {
  let testingModule: TestingModule;
  let habitsDao: HabitsDao;
  let testData: TestDataUtils;
  let habitData: HabitTestDataUtil;

  let user: User;
  let profile: Profile;

  const TEST_KEY = 'habit_schema';

  beforeEach(async () => {
    user = new User({ _id: new mongoose.Types.ObjectId() });
    profile = new Profile(user, { _id: new mongoose.Types.ObjectId() });
    profile.tags = [new Tag({ _id: getObjectId('Test1'), name: 'Test1' })];

    testingModule = await createHabitTestingModule(TEST_KEY, [HabitsDao]).compile();
    habitsDao = testingModule.get(HabitsDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    habitData = testingModule.get(HabitTestDataUtil);
  });

  it('create', async () => {
    const habit = Habit.create(profile, user, {
      title: 'Test',
      text: 'Some Test Habit',
      score: 5,
      max: 3,
      min: 2,
      optimal: 2,
      valueType: DataPointValueType.Number,
      interval: CalendarInterval.Monthly,
      inputType: DataPointInputType.Checkbox,
      userStrategy: UserAssignmentStrategy.Shared,
      tagNames: ['Test1'],
    });

    expect(habit.pid).toEqual(profile._id);
    expect(habit.meta.createdBy).toEqual(user._id);
    expect(habit.meta.createdAs).toBeDefined();
    expect(habit.meta.createdAs.type).toEqual(CreatedAsType.User);
    expect(habit.meta.createdAs.authorId).toEqual(user._id);
    expect(habit.content.title).toEqual('Test');
    expect(habit.config.score).toEqual(5);
    expect(habit.timeSeriesConfig.strategy).toEqual(
      DataPointConfigFactory.getStrategyName(
        DataPointValueType.Number,
        DataPointInputType.Checkbox,
      ),
    );
    expect(habit.timeSeriesConfig.inputType).toEqual(DataPointInputType.Checkbox);
    expect(habit.timeSeriesConfig.valueType).toEqual(DataPointValueType.Number);
    expect(habit.timeSeriesConfig instanceof CheckboxNumberDataPointConfig).toEqual(true);
    expect(habit.timeSeriesConfig.max).toEqual(3);
    expect(habit.timeSeriesConfig.min).toEqual(2);
    expect(habit.timeSeriesConfig.optimal).toEqual(2);
    expect(habit.timeSeriesConfig.getSettings()).toBeDefined();
    expect(habit.timeSeriesConfig.interval).toEqual(CalendarInterval.Monthly);
    expect(habit.content.text).toEqual('Some Test Habit');
    expect(habit.tagIds.length).toEqual(1);
    expect(habit.tagIds[0]).toEqual(profile.tags[0]._id);
  });

  async function createHabit(
    data?: Partial<CreateHabitModel>,
    overwrite?: (model: Habit) => void,
  ): Promise<Habit> {
    const { user, profile } = await testData.createUserAndProfile();
    const content = await habitData.createHabit(user, profile, data, overwrite);
    return <Habit>await habitsDao.findByProfileAndId(profile, content._id);
  }

  describe('model transformation', () => {
    it('object id translation', async () => {
      const search = await createHabit();
      const dto = instanceToPlain(new HabitModel(search));
      expect(dto.id).not.toBeFalsy();
      expect(dto.id).toEqual(search._id.toString());
    });

    it('habit data', async () => {
      const search = await createHabit(
        {
          title: 'c1',
          interval: CalendarInterval.Monthly,
          text: 'Test description',
        },
        (model) => {
          model.meta.archived = true;
          model.meta.sortOrder = 3;
        },
      );

      const model = instanceToPlain(new HabitModel(search)) as PropertiesOf<HabitModel>;
      expect(model.config.timeSeries.interval).toEqual(CalendarInterval.Monthly);
      expect(model.content.title).toEqual('c1');
      expect(model.content.text).toEqual('Test description');
      expect(model.type).toEqual(Habit.name);
      expect(model.meta.archived).toEqual(true);
      expect(model.meta.sortOrder).toEqual(3);
    });

    it('empty tags', async () => {
      const search = await createHabit();
      const dto = instanceToPlain(new HabitModel(search));
      expect(dto.tagIds).toEqual([]);
    });

    it('timeSeriesConfig', async () => {
      const search = await createHabit({
        min: 2,
        max: 3,
        optimal: 3,
        score: 5,
      });

      const dto = instanceToPlain(new HabitModel(search)) as HabitModel;
      const timeSeriesConfig = dto.config.timeSeries as NumberDataPointConfig;
      expect(timeSeriesConfig).toBeDefined();
      expect(timeSeriesConfig.min).toEqual(2);
      expect(timeSeriesConfig.max).toEqual(3);
      expect(timeSeriesConfig.optimal).toEqual(3);
    });
  });
});
