import { User, CreatedAsType, Profile, Tag } from '@lyvely/api';
import { Habit } from './index';
import { CalendarInterval } from '@lyvely/dates';
import { CreateHabitModel, HabitModel } from '@lyvely/habits-interface';
import {
  DataPointInputType,
  DataPointValueType,
  CheckboxNumberDataPointConfig,
  DataPointConfigFactory,
  NumberDataPointConfig,
} from '@lyvely/time-series';
import { PropertiesOf, UserAssignmentStrategy } from '@lyvely/common';
import { buildTest, getObjectId, LyvelyTestingModule } from '@lyvely/testing';
import { instanceToPlain } from 'class-transformer';
import { HabitTestDataUtil, habitTestPlugin } from '../testing';
import { HabitsDao } from '../daos';

describe('Habit', () => {
  let testingModule: LyvelyTestingModule;
  let habitsDao: HabitsDao;
  let testData: HabitTestDataUtil;

  let user: User;
  let profile: Profile;

  const TEST_KEY = 'habit_schema';

  beforeEach(async () => {
    user = new User({ _id: getObjectId('userA') });
    profile = new Profile(user, { _id: getObjectId('profileA') });
    profile.tags = [new Tag({ _id: getObjectId('Test1'), name: 'Test1' })];

    testingModule = await buildTest(TEST_KEY)
      .plugins([habitTestPlugin])
      .providers([HabitsDao])
      .compile();
    habitsDao = testingModule.get(HabitsDao);
    testData = testingModule.get(HabitTestDataUtil);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
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
    expect(habit.meta.createdAs!.type).toEqual(CreatedAsType.User);
    expect(habit.meta.createdAs!.authorId).toEqual(user._id);
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
    const content = await testData.createHabit(user, profile, data, overwrite);
    return <Habit>await habitsDao.findByProfileAndId(profile, content._id);
  }

  describe('toModel', () => {
    it('object id translation', async () => {
      const habit = await createHabit();
      const model = habit.toModel();
      expect(model.meta.createdBy).toEqual(habit.meta.createdBy.toString());
    });
  });

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
