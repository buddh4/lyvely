import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { closeInMongodConnection, TestDataUtils } from '@/test';
import { Model } from 'mongoose';
import { ProfileDocument } from '@/profiles';
import { ActivitiesDao } from '../daos/activities.dao';
import { UserDocument } from '@/users';
import {
  ActivityType,
  CalendarIntervalEnum,
  CreateHabitModel,
  HabitModel,
  PropertiesOf,
} from '@lyvely/common';
import { ActivityDocument, Habit } from '../schemas';
import { ActivityTestDataUtil, createActivityTestingModule } from './utils/activities.test.utils';
import { instanceToPlain } from 'class-transformer';
import { NumberDataPointConfig } from '@/time-series';

describe('Activities DAO', () => {
  let testingModule: TestingModule;
  let ActivityModel: Model<ActivityDocument>;
  let UserModel: Model<UserDocument>;
  let ProfilesModel: Model<ProfileDocument>;
  let activitiesDao: ActivitiesDao;
  let testData: TestDataUtils;
  let activityData: ActivityTestDataUtil;

  const TEST_KEY = 'activities_dao';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [ActivitiesDao]).compile();
    ActivityModel = testingModule.get<Model<ActivityDocument>>('ActivityModel');
    ProfilesModel = testingModule.get<Model<ProfileDocument>>('ProfileModel');
    UserModel = testingModule.get<Model<UserDocument>>('UserModel');
    activitiesDao = testingModule.get<ActivitiesDao>(ActivitiesDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    activityData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await ActivityModel.deleteMany({});
    await UserModel.deleteMany({});
    await ProfilesModel.deleteMany({});
    await closeInMongodConnection('activities service');
  });

  async function createHabit(
    data?: Partial<CreateHabitModel>,
    overwrite?: (model: Habit) => void,
  ): Promise<Habit> {
    const { user, profile } = await testData.createUserAndProfile();
    const content = await activityData.createHabit(user, profile, data, overwrite);
    return <Habit>await activitiesDao.findByProfileAndId(profile, content._id);
  }

  describe('HabitModel', () => {
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
          interval: CalendarIntervalEnum.Monthly,
          text: 'Test description',
        },
        (model) => {
          model.meta.isArchived = true;
          model.meta.sortOrder = 3;
        },
      );

      const model = instanceToPlain(new HabitModel(search)) as PropertiesOf<HabitModel>;
      expect(model.config.timeSeries.interval).toEqual(CalendarIntervalEnum.Monthly);
      expect(model.content.title).toEqual('c1');
      expect(model.content.text).toEqual('Test description');
      expect(model.type).toEqual(ActivityType.Habit);
      expect(model.meta.isArchived).toEqual(true);
      expect(model.meta.sortOrder).toEqual(3);
    });

    // TODO: test tags
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
