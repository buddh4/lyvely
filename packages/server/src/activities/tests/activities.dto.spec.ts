import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { closeInMongodConnection } from '../../test/utils/mongoose-test.utils';
import { Model } from 'mongoose';
import { ProfileDocument } from '../../profiles';
import { ActivitiesDao } from '../daos/activities.dao';
import { UserDocument } from '../../users';
import { ActivityType, HabitDto, CalendarIntervalEnum, CreateHabitDto, IHabit } from '@lyvely/common';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { ActivityDocument, Habit } from '../schemas';
import { ActivityTestDataUtil,  createActivityTestingModule } from './utils/activities.test.utils';
import { instanceToPlain } from 'class-transformer';
import { NumberDataPointConfig } from '../../time-series';


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

  async function createHabit(data?: Partial<CreateHabitDto>, overwrite?: Partial<IHabit>): Promise<Habit> {
    const { user, profile } = await testData.createUserAndProfile();
    const content = await activityData.createHabit(user, profile, data, overwrite);
    return await activitiesDao.findByProfileAndId(profile, content._id);
  }

  describe('HabitDto', () => {
    it('object id translation', async () => {
      const search = await createHabit();
      const dto = instanceToPlain(new HabitDto(search));
      expect(dto.id).not.toBeFalsy();
      expect(dto.id).toEqual(search._id.toString());
    });

    it('habit data', async () => {
      const search = await createHabit({
        title: 'c1',
        interval: CalendarIntervalEnum.Monthly,
        text: 'Test description'
      }, {
        archived: true,
        sortOrder: 3
      });

      const model = instanceToPlain(new HabitDto(search));
      expect(model.dataPointConfig.interval).toEqual(CalendarIntervalEnum.Monthly);
      expect(model.title).toEqual('c1');
      expect(model.text).toEqual('Test description');
      expect(model.type).toEqual(ActivityType.Habit);
      expect(model.archived).toEqual(true);
      expect(model.sortOrder).toEqual(3);
    });

    // TODO: test categories
    it('empty categories', async () => {
      const search = await createHabit();
      const dto = instanceToPlain(new HabitDto(search));
      expect(dto.categories).toEqual([]);
    });

    it('dataPointConfig', async () => {
      const search = await createHabit({
        min: 2,
        max: 3,
        optimal: 3,
        score: 5
      });

      const dto = instanceToPlain(new HabitDto(search)) as HabitDto;
      const dataPointConfig = dto.dataPointConfig as NumberDataPointConfig;
      expect(dataPointConfig).toBeDefined();
      expect(dataPointConfig.min).toEqual(2);
      expect(dataPointConfig.max).toEqual(3);
      expect(dataPointConfig.optimal).toEqual(3);
    });
  });
});
